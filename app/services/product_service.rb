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
    all_orders = JSON.parse( shop.bulk_operation_responses.find_by_response_type("all_orders")&.api_raw_data, object_class: OpenStruct)
    
    products_order_count = get_products_with_quantity(all_orders)
    most_popular_products  = products_order_count&.sort_by {|k,v| v}&.reverse    
    most_popular_products = most_popular_products.first(5)&.map(&:first)
  end

  def get_products_with_quantity all_orders
    products_order_count = {}
    all_orders&.each do |order|
      order&.lineItems&.edges.each do |line_item|
        variant = line_item&.node&.variant&.id
        if variant.present?
          if products_order_count["#{variant}"].present?
            products_order_count["#{variant}"] += line_item&.node&.quantity
          else
            products_order_count["#{variant}"] = line_item&.node&.quantity
          end
        end
      end
    end
    products_order_count
  end

  def get_all_customers_of_most_popular_products all_orders, most_popular_products
    customers_with_products = {}
    all_orders.each do |order| 
      order.lineItems.edges.each do |line_item|
        if most_popular_products.include?(line_item&.node&.variant&.id)
          if customers_with_products["#{order.email}"].present?
            customers_with_products["#{order.email}"] << {product: line_item&.node&.variant&.id, variant: line_item.node.variant.id}
          else
            customers_with_products["#{order.email}"] = [{product: line_item&.node&.variant&.id, variant: line_item.node.variant.id}]
          end
        end 
      end 
    end
    customers_with_products
  end

  def create_rebuy(shop_id, most_popular_products)
    shop = Shop.find(shop_id)
    customers_with_products&.map{|customer_email, product|
      customer = CustomerModal.find_by("lower(email) = #{customer_email.downcase}")
      token = SecureRandom.urlsafe_base64(nil, false)
      other_products = most_popular_products - product
      shop.rebuys.create(
        token: token,
        purchased_variants: product,
        other_variants: other_products,
        customer_modal_id: customer.id
      )
    }
  end

end
