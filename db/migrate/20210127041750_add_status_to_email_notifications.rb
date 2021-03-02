class AddStatusToEmailNotifications < ActiveRecord::Migration[6.0]
  def change
    add_column :email_notifications, :status, :boolean
  end
end
