class AddContractUpdatedAtToCustomers < ActiveRecord::Migration[6.0]
  def change
    add_column :customers, :shopify_updated_at, :datetime
  end
end
