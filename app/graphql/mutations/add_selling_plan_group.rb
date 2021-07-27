module Mutations
  class AddSellingPlanGroup < Mutations::BaseMutation
    argument :params, Types::Input::SellingPlanGroupInputType, required: true
    field :plan, Types::SellingPlanGroupType, null: false

    def resolve(params:)
      plan_params = Hash params
      plan_params[:selling_plans_attributes] = plan_params.delete(:selling_plans)

      begin
        plan = current_shop.selling_plan_groups.create!(plan_params)
        { plan: plan }
      rescue ActiveRecord::RecordInvalid, ActiveRecord::RecordNotSaved => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
