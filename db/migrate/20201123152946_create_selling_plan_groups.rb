class CreateSellingPlanGroups < ActiveRecord::Migration[6.0]
  def change
    create_table :selling_plan_groups do |t|
      t.string :internal_name
      t.string :public_name
      t.string :plan_selector_title

      t.timestamps
    end
  end
end
