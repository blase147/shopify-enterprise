class AddAddress1AndAddress2ToCustomerModal < ActiveRecord::Migration[6.0]
  def change
    add_column :customer_modals, :address1, :text
    add_column :customer_modals, :address2, :text
  end
end
