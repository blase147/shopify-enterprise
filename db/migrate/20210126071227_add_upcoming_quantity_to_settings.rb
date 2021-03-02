class AddUpcomingQuantityToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :upcoming_quantity, :string
  end
end
