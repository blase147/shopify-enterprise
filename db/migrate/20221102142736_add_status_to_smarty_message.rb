class AddStatusToSmartyMessage < ActiveRecord::Migration[6.0]
  def change
    add_column :smarty_messages, :status, :boolean, default: true
  end
end
