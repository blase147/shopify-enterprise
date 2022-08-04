class AddExpectedDeliveryDateAndOrderIdToWorldfarePreorders < ActiveRecord::Migration[6.0]
  def change
    add_column :worldfare_pre_orders, :expected_delivery_date, :date
    add_column :worldfare_pre_orders, :order_id, :string
  end
end
