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
              updatedAt
              status
              nextBillingDate
              appAdminUrl
              customer {
                id
                firstName
                lastName
                email
                phone
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
    result = ShopifyAPIRetry::GraphQL.retry { client.query(client.parse(query), variables: { id: @customer_id }) }

    data = result.data&.customer
    return nil unless data.present?

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
end
