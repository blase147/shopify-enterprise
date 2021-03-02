class AddParamsToCustomers < ActiveRecord::Migration[6.0]
  def change
    add_column :customers, :status, :string
    add_column :customers, :subscription, :string
    add_column :customers, :language, :string
    add_column :customers, :auto_collection, :boolean
  end
end
