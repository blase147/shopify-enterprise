class AddSlugToEmailNotification < ActiveRecord::Migration[6.0]
  def change
    add_column :email_notifications, :slug, :string
  end
end
