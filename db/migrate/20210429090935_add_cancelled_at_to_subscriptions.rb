class AddCancelledAtToSubscriptions < ActiveRecord::Migration[6.0]
  def change
    add_column :subscription_contracts, :shopify_created_at, :datetime
    add_column :subscription_contracts, :cancelled_at, :datetime
    add_column :subscription_contracts, :status, :string
  end
end
