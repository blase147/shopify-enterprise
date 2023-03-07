class ChangesSellingPlanToOptionalInMembership < ActiveRecord::Migration[6.0]
    def change
        change_column_null :memberships, :selling_plan_id, true
    end
end
  