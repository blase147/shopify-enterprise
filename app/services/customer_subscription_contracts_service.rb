class CustomerSubscriptionContractsService < GraphqlService
  PAGE = 10

  LIST_QUERY = <<-GRAPHQL
    query($id: ID!){
      customer(id: $id) {
        id
        subscriptionContracts(first: #{PAGE}, reverse: true) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              id
              createdAt
              status
              nextBillingDate
              appAdminUrl
              customer {
                firstName
                lastName
              }
              lines(first: 10) {
                edges {
                  node {
                    id
                    title
                    productId
                    quantity
                    sellingPlanId
                    pricingPolicy
                    variantId
                    sellingPlanName
                    currentPrice {
                      amount
                    }
                  }
                }
              }
              orders(first: 10, reverse: true) {
                edges {
                  node {
                    id
                    totalReceivedSet {
                      presentmentMoney {
                        amount
                      }
                    }
                  }
                }
              }
              originOrder {
                id
              }
              billingPolicy {
                interval
                intervalCount
              }
              deliveryMethod {
                ... on SubscriptionDeliveryMethodShipping {
                  address {
                    address1
                    address2
                    city
                    country
                    phone
                    zip
                    firstName
                    lastName
                    company
                    province
                  }
                }
              }
            }
          }
        }
      }
    }
  GRAPHQL

  CREATE_QUERY = <<-GRAPHQL
    query($id: ID!){
      customer(id: $id) {
        id
        subscriptionContracts(first: #{PAGE}, reverse: true) {
          edges {
            node {
              id
              status
              createdAt
            }
          }
        }
      }
    }
  GRAPHQL

  def initialize customer_id
    @customer_id = customer_id
  end

  def run cursor=nil
    query = LIST_QUERY
    query = query.gsub("first: #{PAGE}", "first: #{PAGE} after: \"#{cursor}\"") if cursor.present?
    result = client.query(client.parse(query), variables: { id: @customer_id })

    data = result.data.customer
    subscriptions = data.subscription_contracts.edges.map do |edge|
      edge
    end

    return {
      subscriptions: subscriptions.map(&:node),
      active_subscriptions: subscriptions.select { |subscription| subscription.node.status == 'ACTIVE' },
      cancelled_subscriptions: subscriptions.select { |subscription| subscription.node.status == 'CANCELLED' },
      has_next_page: data.subscription_contracts.page_info.has_next_page,
      has_previous_page: data.subscription_contracts.page_info.has_previous_page,
      next_cursor: subscriptions.last&.cursor,
      prev_cursort: subscriptions.first&.cursor
    }

  # rescue Exception => ex
  #   p ex.message
  #   { error: ex.message }
  end

  def create_contracts
    result = client.query(client.parse(CREATE_QUERY), variables: { id: @customer_id })
    data = result.data.customer
    data.subscription_contracts.edges.each do |subscription|
      node = subscription.node
      contract = SubscriptionContract.find_or_create_by(shopify_id: node.id, customer_shopify_id: data.id)
      contract.update(status: node.status, shopify_created_at: node.created_at)
    end
  end
end
