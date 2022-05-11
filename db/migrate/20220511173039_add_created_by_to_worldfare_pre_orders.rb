class AddCreatedByToWorldfarePreOrders < ActiveRecord::Migration[6.0]
  def change
    add_column :worldfare_pre_orders, :created_by, :string
  end
end
