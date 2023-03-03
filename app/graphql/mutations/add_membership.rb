module Mutations
    class AddMembership < Mutations::BaseMutation
      argument :params, Types::Input::MembershipInputType, required: true
      field :membership, Types::MembershipType, null: false
  
      def resolve(params:)
        membership_params = Hash params
        begin
          selling_pan = JSON.parse(membership_params[:selling_plan].to_json)
          selling_plan = SellingPlan.find_by_shopify_id(selling_pan.first["sellingPlanId"])
          membership_params.delete(:selling_plan)
          membership_params[:selling_plan_id] = selling_plan.id
          membership = current_shop.memberships.create!(membership_params)
  
          membership.save
          { membership: membership }
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
            " #{e.record.errors.full_messages.join(', ')}")
        end
      end
    end
end