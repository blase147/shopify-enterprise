class AddOrderLineItem < GraphqlService
  BEGIN_ORDER = <<-GRAPHQL
    mutation($orderID: ID!){
     orderEditBegin(id: $orderID){
        calculatedOrder{
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  GRAPHQL

  ADD_VARIANT = <<-GRAPHQL
    mutation($id: ID!, $variantId: ID!, $quantity: Int!){
      orderEditAddVariant(id: $id, variantId: $variantId, quantity: $quantity){
        calculatedOrder {
          id
          addedLineItems(first:5) {
            edges {
              node {
                id
                quantity
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  GRAPHQL

  COMMIT_DONE = <<-GRAPHQL
    mutation($id: ID!) {
      orderEditCommit(id: $id, notifyCustomer: false, staffNote: "I edited the order! It was me!") {
        order {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  GRAPHQL

  GET_PRODCUT = <<-GRAPHQL
    query($id: ID!){
      product(id: $id) {
        id
        title
        variants (first: 10) {
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
  GRAPHQL

  def initialize(order_id, product_ids)
    @order_id = order_id
    @product_ids = product_ids

  end

  def call(contract_id, week_number, expected_order_delivery)
    
    contract = CustomerSubscriptionContract.find_by_id contract_id
    pre_order = WorldfarePreOrder.find_by(shopify_contract_id: contract.shopify_id, week: week_number)
    # update preorder
    pre_order.update(order_id: @order_id, expected_delivery_date: expected_order_delivery)
    # Send email notification to user after filling order
    PreOrderEmailNotificationWorker.perform_in(360.seconds, contract_id, week_number)
    
    calculated_order_id = order_edit_begin

    product_variants = fetch_product_varients

    product_variants_count = product_variants.tally

    product_variants_count.each do |variant_id, quantity|
      varient_result = add_variant(variant_id, calculated_order_id, quantity)
    end

    result = finish_order_edit(calculated_order_id)
    result
  end


  def order_edit_begin
    being_order = client.query(client.parse(BEGIN_ORDER), variables: {
      orderID: "gid://shopify/Order/#{@order_id}"
    })
    calculated_id = being_order.data.order_edit_begin.calculated_order.id
  end

  def fetch_product_varients
    varient_ids = []
    @product_ids.each do |product_id|
      fetch_product = client.query(client.parse(GET_PRODCUT), variables: {
        id: "gid://shopify/Product/#{product_id}"
      })
      varient_ids << fetch_product.data.product.variants.edges.first.node.id
    end
    varient_ids
  end

  def add_variant(varient_id, calculated_order_id, quantity)
    add_variant = client.query(client.parse(ADD_VARIANT), variables: {
      id: calculated_order_id,
      variantId: varient_id,
      quantity: quantity
    })
  end

  def finish_order_edit(calculated_order_id)
    commit_variant = client.query(client.parse(COMMIT_DONE), variables: {
      id: calculated_order_id
    })
    commit_variant.data
  end
  
end
