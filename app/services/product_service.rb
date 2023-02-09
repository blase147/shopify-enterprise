class ProductService < GraphqlService
  GET_QUERY = <<-GRAPHQL
    query($id: ID!){
      product(id: $id) {
        id
        title
        sellingPlanGroupCount
        requiresSellingPlan
      }
    }
  GRAPHQL

  GET_PRODUCTS_BY_PRICE_QUERY = <<-GRAPHQL
    query($price: String!) {
      products (first: 30, query: $price) {
        edges {
          node {
            title
            sellingPlanGroupCount
            images (first: 1) {
              edges {
                node {
                  originalSrc
                }
              }
            }
            variants ( first: 10) {
              edges {
                node {
                  id
                  title
    							price
                }
              }
            }
          }
        }
      }
    }
  GRAPHQL

  GET_PRODUCTS_QUERY = <<-GRAPHQL
    {
      products (first: 85, query: "status:active") {
        edges {
          node {
            id
            title
            requiresSellingPlan
            sellingPlanGroupCount
            images (first: 1) {
              edges {
                node {
                  originalSrc
                }
              }
            }
            variants ( first: 5) {
              edges {
                node {
                  id
                  title
    							price
                }
              }
            }
          }
        }
      }
    }
  GRAPHQL

  GET_SUBSCRIPTION_PRODUCTS_QUERY = <<-GRAPHQL
    query($sellingPlanGroupCursor: String, $productCursor: String){
      sellingPlanGroups(first: 5, after: $sellingPlanGroupCursor){
        edges{
          cursor
          node{
            id
            productCount
            options
            sellingPlans(first: 10){
              edges{
                node{
                  id
                  name
                  options
                }
              }
            }
            products (first: 5, after: $productCursor) {
              edges {
                cursor
                node {
                  id
                  title
                  images (first: 1) {
                    edges {
                      node {
                        originalSrc
                      }
                    }
                  }
                  variants ( first: 20) {
                    edges {
                      node {
                        id
                        title
                        price
                      }
                    }
                  }
                }
              }
              pageInfo{
                hasNextPage
              }
            }
          }
        }
        pageInfo{
          hasNextPage
        }
      }
    }
  GRAPHQL

  def initialize(id = nil)
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

  def by_price(price)
    result = client.query(client.parse(GET_PRODUCTS_BY_PRICE_QUERY), variables: { price: "price:>#{price}"} )
    result.data.products.edges
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def list
    result = ShopifyAPIRetry::GraphQL.retry { client.query(client.parse(GET_PRODUCTS_QUERY)) }
    result.data&.products&.edges
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def list_subscribable(cursor=nil)
    variables = {}
    if cursor.present?
      variables = {sellingPlanGroupCursor: cursor}
    end
    result = ShopifyAPIRetry::GraphQL.retry { client.query(client.parse(GET_SUBSCRIPTION_PRODUCTS_QUERY), variables: variables) }
    result.data rescue []
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def get_most_popular_products(shop_id)
    shop = Shop.find(shop_id).includes(:bulk_operation_responses)
    bulk_orders = shop.bulk_operation_responses.find_by_response_type("all_orders")&.api_raw_data
    all_orders = JSON.parse(bulk_orders, object_class: OpenStruct)
    
    products_order_count = get_products_with_quantity(all_orders)
    most_popular_products = products_order_count&.sort_by {|k,v| v}&.reverse    
    most_popular_products.first(5)
  end

  def get_products_with_quantity all_orders
    products_order_count = {}
    all_orders&.each do |order|
      order.lineItems.edges.each do |line_item|
        product = line_item.node.product.id
        if products_order_count["#{product}"].present?
          products_order_count["#{product}"] += line_item.node.quantity
        else
          products_order_count["#{product}"] = line_item.node.quantity
        end
      end
    end
    products_order_count
  end
end
