class ChangeColumnToNewFromWorldfarePreOrder < ActiveRecord::Migration[6.0]
  def change
    change_table :worldfare_pre_orders do |table|
      table.change :customer_id, :string
    end
  end
end
