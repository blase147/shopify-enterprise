class AddIndexToSettings < ActiveRecord::Migration[6.0]
  def change
    add_index :settings, :shop_id, unique: true
  end
end
