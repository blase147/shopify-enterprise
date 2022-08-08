class CreateOrderIdUniqueIndexInWorldfarePreOrder < ActiveRecord::Migration[6.0]
  def change
    add_index :worldfare_pre_orders, :order_id, unique: true
    change_column_default :worldfare_pre_orders, :created_at, from: nil, to: ->{ 'now()' }
    change_column_default :worldfare_pre_orders, :updated_at, from: nil, to: ->{ 'now()' }
  end
end
