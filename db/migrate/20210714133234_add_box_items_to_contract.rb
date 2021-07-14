class AddBoxItemsToContract < ActiveRecord::Migration[6.0]
  def change
    add_column :customers, :box_items, :string
  end
end
