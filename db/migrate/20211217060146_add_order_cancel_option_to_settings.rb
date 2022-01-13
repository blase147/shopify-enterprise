class AddOrderCancelOptionToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :order_cancel_option, :string
  end
end
