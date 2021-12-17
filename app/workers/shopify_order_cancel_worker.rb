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

    if data&.data&.order&.line_items&.edges&.first&.node&.contract&.id.present?
      if shop.setting.order_cancel_option == 'Cancel Subscription'
        id = data&.data&.order&.line_items&.edges&.first&.node&.contract&.id
        SubscriptionContractDeleteService.new(id).run
      elsif shop.setting.order_cancel_option == 'Email to admin'

      end

    end

    # data.
  end
end
