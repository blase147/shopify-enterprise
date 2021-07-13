class AddProductExtentensionDesignTypeToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :design_type, :integer, default: 0
  end
end
