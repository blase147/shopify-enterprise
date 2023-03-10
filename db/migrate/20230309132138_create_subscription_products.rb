class CreateSubscriptionProducts < ActiveRecord::Migration[6.0]
    def change
      create_table :subscription_products do |t|
        t.references :selling_plan, null: true, foreign_key: true
        t.references :shop, null: false, foreign_key: true
        t.jsonb :product_images
        t.string :status
  
        t.timestamps
      end
    end
end
  