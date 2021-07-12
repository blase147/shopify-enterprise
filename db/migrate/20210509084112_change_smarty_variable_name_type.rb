class ChangeSmartyVariableNameType < ActiveRecord::Migration[6.0]
  def self.up
    change_column :smarty_variables, :name, :string
  end

  def self.down
    change_column :smarty_variables, :name, :integer
  end
end
