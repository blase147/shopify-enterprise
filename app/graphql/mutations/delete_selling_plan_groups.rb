module Mutations
    class DeleteSellingPlanGroups < Mutations::BaseMutation
      argument :params, [String], required: true
      field :sellingPlans, [Types::SellingPlanGroupType], null: false

      def resolve(params:)
        plan_params = params

        begin
           SellingPlanGroup.destroy(plan_params)
           sellingPlans = current_shop.selling_plan_groups.order(created_at: :desc)
           {sellingPlans: sellingPlans}
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
            " #{e.record.errors.full_messages.join(', ')}")
        end
      end
    end
  end