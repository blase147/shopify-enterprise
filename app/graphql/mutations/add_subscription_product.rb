module Mutations
  class AddSubscriptionProduct < Mutations::BaseMutation
    argument :params, Types::Input::SubscriptionProductInputType, required: true
    field :subscription_product, Types::SubscriptionProductType, null: false

    def resolve(params:)
      subscription_product_params = Hash params
      begin
        unless subscription_product_params[:selling_plan] == "all"
          selling_pan = JSON.parse(subscription_product_params[:selling_plan].to_json)
          selling_plan = SellingPlan.find_by_shopify_id(selling_pan.first["sellingPlanId"])
          subscription_product_params[:selling_plan_id] = selling_plan.id
        end
        subscription_product_params.delete(:selling_plan)
        membership = current_shop.subscription_products.create!(subscription_product_params)

        membership.save
        { membership: membership }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end