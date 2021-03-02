class CreateSubscriptionContracts < ActiveRecord::Migration[6.0]
  def change
    create_table :subscription_contracts do |t|
      t.string :shopify_id
      t.string :first_name
      t.string :last_name
      t.string :customer_shopify_id
      t.string :shipment_status

      t.date :order_date
      t.string :tracking_url
      t.string :product
      t.decimal :total
      t.integer :shop_id

      t.timestamps
    end
  end
end
