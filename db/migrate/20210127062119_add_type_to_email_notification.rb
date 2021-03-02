class AddTypeToEmailNotification < ActiveRecord::Migration[6.0]
  def change
    add_column :email_notifications, :type, :string
  end
end
