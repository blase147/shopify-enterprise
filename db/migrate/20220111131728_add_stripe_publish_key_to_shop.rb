class AddStripePublishKeyToShop < ActiveRecord::Migration[6.0]
  def change
    add_column :shops, :stripe_publish_key, :text
  end
end
