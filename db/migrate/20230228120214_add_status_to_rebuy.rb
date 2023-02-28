class AddStatusToRebuy < ActiveRecord::Migration[6.0]
  def change
    add_column :rebuys, :status, :string, default: "open"
  end
end
