class AddCustomerIdToCustomers < ActiveRecord::Migration[6.0]
  def change
    add_column :customers, :shopify_customer_id, :string
  end
end
