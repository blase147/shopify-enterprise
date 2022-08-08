class AddStatusToWorldfarePreOrder < ActiveRecord::Migration[6.0]
  def change
    add_column :worldfare_pre_orders, :status, :string
  end
end
