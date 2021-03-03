class AddShopifyAtToCustome < ActiveRecord::Migration[6.0]
  def change
    add_column :customers, :shopify_at, :datetime
  end
end
