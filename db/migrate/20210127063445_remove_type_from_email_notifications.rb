class RemoveTypeFromEmailNotifications < ActiveRecord::Migration[6.0]
  def change
    remove_column :email_notifications, :type, :string
  end
end
