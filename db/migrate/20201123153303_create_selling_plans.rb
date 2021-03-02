class CreateSellingPlans < ActiveRecord::Migration[6.0]
  def change
    create_table :selling_plans do |t|
      t.integer :selling_plan_group_id
      t.string :name
      t.string :selector_label
      t.text :description
      t.string :interval_type
      t.integer :interval_count
      t.integer :min_fullfilment
      t.integer :max_fullfilment
      t.string :adjustment_type
      t.decimal :adjustment_value

      t.timestamps
    end
  end
end
