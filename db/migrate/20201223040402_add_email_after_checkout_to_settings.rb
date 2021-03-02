class AddEmailAfterCheckoutToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :email_after_checkout, :boolean
  end
end
