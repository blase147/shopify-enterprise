class AddAttrToCustomer < ActiveRecord::Migration[6.0]
  def change
    add_column :customers, :country, :string
    add_column :customers, :city, :string
    add_column :customers, :province, :string
    add_column :customers, :zip, :string
    add_column :customers, :company, :string
  end
end
