class AddShopToCustomerModal < ActiveRecord::Migration[6.0]
  def change
    add_reference :customer_modals, :shop, index: true, foreign_key: true
  end
end
