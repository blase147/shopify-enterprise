class CreateEmailNotifications < ActiveRecord::Migration[6.0]
  def change
    create_table :email_notifications do |t|
      t.string :name
      t.string :descripton
      t.string :from_name
      t.string :from_email
      t.string :email_subject
      t.text :email_message

      t.timestamps
    end
  end
end
