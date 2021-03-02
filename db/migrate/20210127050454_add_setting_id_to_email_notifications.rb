class AddSettingIdToEmailNotifications < ActiveRecord::Migration[6.0]
  def change
    add_column :email_notifications, :setting_id, :integer
  end
end
