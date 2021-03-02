class GraphqlService
  def client
    @client ||= ShopifyAPI::GraphQL.client
  end
end