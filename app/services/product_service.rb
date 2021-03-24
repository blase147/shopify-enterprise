class ProductService < GraphqlService
  GET_QUERY = <<-GRAPHQL
    query($id: ID!){
      product(id: $id) {
        id
        sellingPlanGroupCount
        requiresSellingPlan
      }
    }
  GRAPHQL

  def initialize id
    @id = id
  end

  def run
    id = "gid://shopify/Product/#{@id}"

    result = client.query(client.parse(GET_QUERY), variables: { id: id} )
    result.data.product
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end
