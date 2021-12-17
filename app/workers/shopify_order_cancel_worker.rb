class ShopifyOrderCancelWorker
  include Sidekiq::Worker

  GET_QUERY = <<-GRAPHQL
    query($id: ID!){
      order(id: $id) {
        id
        lineItems(first: 5){
          edges{
            node{
              contract{
                id
              }
            }
          }
        }
      }
    }
  GRAPHQL

  def perform(shop_id, id)
    shop = Shop.find(shop_id)
    graphql_id = "gid://shopify/Order/#{id}"

    data = shop.with_shopify_session do
      client = ShopifyAPI::GraphQL.client
      ShopifyAPIRetry::GraphQL.retry { client.query(client.parse(GET_QUERY), variables: { id: graphql_id} ) }
    end

    # data.
  end
end
