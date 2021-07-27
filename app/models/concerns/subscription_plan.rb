module SubscriptionPlan
  extend ActiveSupport::Concern

  included do
    before_create :create_shopify
    before_update :update_shopify
    before_destroy :delete_shopify

    UPDATE_QUERY = <<-GRAPHQL
      mutation($input: SellingPlanGroupInput!, $id: ID!, $deleteProductIds: [ID!]!, $deleteVariantIds: [ID!]!, $addProductIds: [ID!]!, $addVariantIds: [ID!]!){
        sellingPlanGroupUpdate(id: $id, input: $input){
          sellingPlanGroup {
            id
            sellingPlans(first: 10){
              edges {
                node {
                  id
                }
              }
            }
          }
          userErrors {
            field
            message
          }
         }

         sellingPlanGroupRemoveProducts(id: $id, productIds: $deleteProductIds) {
           removedProductIds
           userErrors
           {
             code
             field
             message
           }
         }

         sellingPlanGroupRemoveProductVariants(id: $id, productVariantIds: $deleteVariantIds) {
           removedProductVariantIds
           userErrors {
           code
           field
           message
           }
         }

         sellingPlanGroupAddProducts(id: $id, productIds: $addProductIds) {
           sellingPlanGroup {
             id
           }
           userErrors {
             code
             field
             message
           }
         }
         sellingPlanGroupAddProductVariants(id: $id, productVariantIds: $addVariantIds) {
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

    DELETE_QUERY = <<-GRAPHQL
     mutation($id: ID!, $productIds: [ID!]!, $variantIds: [ID!]!) {
        sellingPlanGroupDelete(id: $id) {
          deletedSellingPlanGroupId
          userErrors {
            code
            field
            message
          }
        }
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
            sellingPlans(first: 10){
              edges {
                node {
                  id
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

    def delete_shopify
      input = { id: self.shopify_id, productIds: self.product_ids.present? ? self.product_ids.map { |p| p['product_id'] } : [], variantIds: self.variant_ids.present? ? self.variant_ids.map { |p| p['variant_id'] } : [] }
      result = client.query(client.parse(DELETE_QUERY), variables: input)
      puts '#####'
      p result

      error = result.errors.messages["data"][0]rescue nil
      error ||= result.data.selling_plan_group_delete.user_errors.first.message rescue nil
      raise error if error.present?
    rescue Exception => e
      errors.add :base, e.message
      throw(:abort)
    end

    def update_shopify
      input = {
        name: self.public_name,
        merchantCode: self.internal_name,
        options: [self.plan_selector_title],
        sellingPlansToCreate: create_selling_plans,
        sellingPlansToUpdate: update_selling_plans
      }
      if delete_selling_plans.count > 0
        delete_input = { sellingPlansToDelete: delete_selling_plans }
        result = client.query(client.parse(UPDATE_QUERY), variables: { input: delete_input, id: self.shopify_id, deleteProductIds: deleted_products, deleteVariantIds: deleted_variants, addProductIds: added_products, addVariantIds: added_variants})
        error = result.errors.messages["data"][0]rescue nil
        error ||= result.data.selling_plan_group_update.user_errors.first.message rescue nil
        raise error if error.present?
      end

      result = ShopifyAPIRetry::GraphQL.retry { client.query(client.parse(UPDATE_QUERY), variables: { input: input, id: self.shopify_id, deleteProductIds: deleted_products, deleteVariantIds: deleted_variants, addProductIds: added_products, addVariantIds: added_variants}) }
      puts '#####'
      p result

      error = result.errors.messages["data"][0]rescue nil
      error ||= result.data.selling_plan_group_update.user_errors.first.message rescue nil

      if error.present?
        raise error
      else
        self.update_columns(product_ids: self.product_ids.present? ? self.product_ids.select{|p| !p['_destroy']} : nil, variant_ids: self.variant_ids.present? ? self.variant_ids.select{|p| !p['_destroy']} : nil)
      end

      plans = result.data.selling_plan_group_update.selling_plan_group.selling_plans.edges
      self.selling_plans.each_with_index do |plan, index|
        plan.shopify_id ||= plans[index].node.id
      end
    rescue Exception => e
      errors.add :base, e.message
      throw(:abort)
    end

    def deleted_products
      self.product_ids.present? ? self.product_ids.map{|p| p["product_id"] if p["_destroy"]}.compact : []
    end

    def deleted_variants
      self.variant_ids.present? ? self.variant_ids.map{|p| p["variant_id"] if p["_destroy"]}.compact : []
    end

    def added_products
      self.product_ids.present? ? self.product_ids.map{|p| p["product_id"] unless p["_destroy"]}.compact : []
    end

    def added_variants
      self.variant_ids.present? ? self.variant_ids.map{|p| p["variant_id"] unless p["_destroy"]}.compact : []
    end

    def create_shopify
      input = {
        name: self.public_name,
        merchantCode: self.internal_name,
        options: [self.plan_selector_title],
        sellingPlansToCreate: create_selling_plans
      }

      self.resources = {
        productIds: self.product_ids.present? ? self.product_ids.map { |p| p['product_id'] } : [],
        productVariantIds: self.variant_ids.present? ? self.variant_ids.map { |p| p['variant_id'] } : []
      }
      result = client.query(client.parse(CREATE_QUERY), variables: { input: input, resources: (self.resources ||  [])})
      puts '#####'
      p result

      error = result.errors.messages["data"][0]rescue nil
      error ||= result.data.selling_plan_group_create.user_errors.first.message rescue nil

      raise error if error.present?

      self.shopify_id = result.data.selling_plan_group_create.selling_plan_group.id
      plans = result.data.selling_plan_group_create.selling_plan_group.selling_plans.edges
      self.selling_plans.each_with_index do |plan, index|
        plan.shopify_id = plans[index].node.id
      end
    rescue Exception => e
      errors.add :base, e.message
      throw(:abort)
    end

    private ##

    def update_selling_plans
      self.selling_plans.select {|s| s.id.present? && !s.marked_for_destruction? }.map {|s| selling_plan_info(s, s.shopify_id) }
    end

    def delete_selling_plans
      self.selling_plans.select {|s| p s._destroy }.map(&:shopify_id)
    end

    def create_selling_plans
      self.selling_plans.select {|s| s.id.nil? }.map {|s| selling_plan_info(s) }
    end

    def selling_plan_info selling_plan, id=nil
      adjustment_value = if selling_plan.adjustment_type == 'PERCENTAGE'
                          { selling_plan.adjustment_type.downcase => selling_plan.adjustment_value.to_i }
                        else
                          { fixedValue: selling_plan.adjustment_value.to_i }
                        end

      # interval_type = case selling_plan.interval_type
      # when 'Days'
      #   'DAY'
      # when 'Weeks'
      #   'WEEK'
      # when 'Months'
      #   'MONTH'
      # when 'Years'
      #   'YEAR'
      # end

      info = {
        name: selling_plan.name,
        description: selling_plan.description || '',
        options: [
          selling_plan.selector_label
        ],
        billingPolicy: {
          recurring: {
            interval: selling_plan.interval_type,
            intervalCount: selling_plan.interval_count,
            minCycles: selling_plan.min_fullfilment,
            maxCycles: selling_plan.max_fullfilment
          }
        },
        deliveryPolicy: {
          recurring: {
            interval: selling_plan.delivery_interval_type,
            intervalCount: selling_plan.delivery_interval_count
          }
        },
        pricingPolicies: [
          {
            fixed: {
              adjustmentType: selling_plan.adjustment_type,
              adjustmentValue: adjustment_value
            }
          }
        ]
      }

      id.nil? ? info : info.merge(id: id)
    end
  end

  def client
    @client ||= ShopifyAPI::GraphQL.client
  end
end
