class CreateWeeklyMenus < ActiveRecord::Migration[6.0]
  def change
    create_table :weekly_menus do |t|
      t.integer :box_subscription_type
      t.json :collection_images
      t.json :product_images
      t.json :triggers
      t.json :selling_plans
      t.string :selling_plan_ids
      t.string :display_name
      t.integer :week
      t.date :cutoff

      t.timestamps
    end
  end
end
