class AddTemplateIdToEmailNotifications < ActiveRecord::Migration[6.0]
  def change
  	add_column :email_notifications, :template_identity, :string
  	add_column :email_notifications, :hypertext, :text
  end
end
