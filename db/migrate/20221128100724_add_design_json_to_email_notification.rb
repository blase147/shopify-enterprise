class AddDesignJsonToEmailNotification < ActiveRecord::Migration[6.0]
  def change
    add_column :email_notifications, :design_json, :text
  end
end
