class SellingPlanService < GraphqlService
  ADD_QUERY = <<-GRAPHQL
    mutation($id: ID!, $productIds: [ID!]!) {  
      sellingPlanGroupAddProducts(id: $id, productIds: $productIds) {    
        sellingPlanGroup {      
          id    
        }    
        userErrors {      
          code      
          field      
          message    
        }  
      }
    }
  GRAPHQL

  GET_SELLINGPLAN = <<-GRAPHQL
    query($id: ID!){
      sellingPlanGroup(id: $id) {
        id
        sellingPlans(first: 10){
          edges{
            node{
          
              id
              name
            }
          }
        }
      }
    }
  GRAPHQL

  REMOVE_QUERY = <<-GRAPHQL
    mutation($id: ID!, $productIds: [ID!]!, $variantIds: [ID!]!) {  
      sellingPlanGroupRemoveProducts(id: $id, productIds: $productIds) {    
        removedProductIds    
        userErrors 
        {      
          code      
          field      
          message    
        }  
      }  

      sellingPlanGroupRemoveProductVariants(id: $id, productVariantIds: $variantIds) {
        removedProductVariantIds    
        userErrors {      
        code      
        field      
        message    
        }
      }
    }
  GRAPHQL

  CREATE_QUERY = <<-GRAPHQL
    mutation($input: SellingPlanGroupInput!, $resources: SellingPlanGroupResourceInput!){
      sellingPlanGroupCreate(input: $input, resources: $resources){
        sellingPlanGroup {
          id
          name
          merchantCode
        }
        userErrors {
          field
          message
        }
       }
    }
  GRAPHQL

  def run type, body={}
    case type
    when 'plans'
      data = SubscriptionPlanService.new.plans.data.selling_plan_groups.edges.map do |plan|
        { value: plan.node.id, label: plan.node.name}
      end

      data = [{value: nil, label: '-- Select --'}] | data
    when 'add'
      input = { id: body[:id], productIds: [body[:productId]], variantIds: [body[:variantId]] }
      result = client.query(client.parse(ADD_QUERY), variables: input )

      errors = result.data.selling_plan_group_add_products.user_errors
      raise errors.first.message if errors.present?
    when 'create'
      group_name = body[:name] || body[:planTitle]
      interval = body[:interval] || 'WEEK'
      interval_count = body[:interval_count] || body[:deliveryFrequency].to_i # 3
      option = "#{interval_count} #{interval.downcase.pluralize(interval_count)}" # 3 weeks
      fullfilment = body[:max_fullfilment]
      adjustment_type = body[:adjustment_type] || 'PERCENTAGE'
      adjustment_value = body[:adjustment_value] || body[:percentageOff]

      plan_name = "#{group_name}- delivery every #{option}"
      
      selling_plan_group_params = {
        internal_name: group_name,
        public_name: group_name,
        plan_selector_title: "Deliver every",
        shop_id: body[:shop_id],
        selling_plans_attributes: [{
          name: plan_name,
          selector_label: option,
          interval_type: interval,
          interval_count: interval_count,
          max_fullfilment: fullfilment,
          adjustment_type: adjustment_type,
          adjustment_value: adjustment_value,
        }]
      }

      selling_group = SellingPlanGroup.new selling_plan_group_params
      selling_group.resources = {
        productIds: [body[:productId]],
        productVariantIds: []
      }

      raise selling_group.errors.full_messages.to_sentence unless selling_group.save
    when 'remove'
      input = { id: body[:sellingPlanGroupId], productIds: [body[:productId]], variantIds: body[:variantIds] }
      result = client.query(client.parse(REMOVE_QUERY), variables: input )

      errors = result.data.selling_plan_group_remove_products.user_errors
      raise errors.first.message if errors.present?
    when 'edit'
    end

    { success: true, data: data }
  rescue Exception => ex
    { error: ex.message }
  end
end