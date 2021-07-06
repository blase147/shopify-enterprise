module Mutations
  class UpdateSellingPlanGroup < Mutations::BaseMutation
    argument :params, Types::Input::SellingPlanGroupInputType, required: true
    field :plan, Types::SellingPlanGroupType, null: false

    def resolve(params:)
      plan_params = Hash params
      id = params[:id]

      begin
        plan_params[:selling_plans_attributes] = plan_params.delete(:selling_plans)

        plan = current_shop.selling_plan_groups.find_by(id: params[:id])
        plan.update!(plan_params)

        { plan: plan }
      rescue ActiveRecord::RecordInvalid, ActiveRecord::RecordNotSaved => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
