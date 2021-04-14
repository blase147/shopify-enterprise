class CreateSellingPlanBoxes < ActiveRecord::Migration[6.0]
  def change
    create_table :selling_plan_boxes do |t|
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
      t.string :trial_interval_type
      t.integer :trial_interval_count
      t.string :trial_adjustment_type
      t.decimal :trial_adjustment_value
      t.integer :box_subscription_type
      t.boolean :box_is_quantity
      t.boolean :box_is_quantity_limited
      t.integer :box_quantity_limit
      t.timestamps
    end
  end
end
