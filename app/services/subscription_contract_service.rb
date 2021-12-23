class SubscriptionContractService < GraphqlService
  GET_QUERY = <<-GRAPHQL
    query($id: ID!){
      subscriptionContract(id: $id) {
        id
        createdAt
        updatedAt
        status
        nextBillingDate
        appAdminUrl
        lines(first: 10) {
          edges {
            node {
              title
              id
              quantity
              productId
              sellingPlanId
              pricingPolicy
              sellingPlanName
              variantId
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
              name
              createdAt
              netPaymentSet
              totalReceivedSet {
                presentmentMoney {
                  amount
                }
              }

              events(first: 10, reverse: true) {
                pageInfo
                edges {
                  node {
                    id
                    createdAt
                    message
                  }
                }
              }
            }
          }
        }
        customer {
          id
          displayName
          firstName
          lastName
          email
          phone
          paymentMethods(first: 5) {
            edges {
              node {
                id
                instrument
              }
            }
          }
          defaultAddress {
            id
            formatted
            address1
            address2
          }
        }
        originOrder {
          id
          shippingAddress {
            formatted
          }
          lineItems(first:10) {
            edges {
              node {
                id
                quantity
                customAttributes{
                  ... on Attribute{
                    key
                    value
                  }
                }
                sellingPlan {
                  name
                }
              }
            }
          }
        }
        customerPaymentMethod {
          id
        }
        deliveryMethod
        deliveryPolicy {
          interval
          intervalCount
        }
        billingPolicy {
          interval
          intervalCount
        }
      }
    }
  GRAPHQL

  def initialize id
    @id = id
  end

  def run
    id = if @id.is_a?(String) && @id.include?('SubscriptionContract')
      @id
    else
      "gid://shopify/SubscriptionContract/#{@id}"
    end
    result = ShopifyAPIRetry::GraphQL.retry { client.query(client.parse(GET_QUERY), variables: { id: id} ) }
    return result.data.subscription_contract
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end
