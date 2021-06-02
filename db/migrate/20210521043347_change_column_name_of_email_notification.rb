class ChangeColumnNameOfEmailNotification < ActiveRecord::Migration[6.0]
  def self.up
    rename_column :email_notifications, :descripton, :description
  end

  def self.down
    rename_column :email_notifications, :description, :descripton
  end
end
