class AddColumnsToCustomer < ActiveRecord::Migration[6.0]
  def change
    add_column :customers, :pack, :string
    add_column :customers, :frequency, :string
  end
end
