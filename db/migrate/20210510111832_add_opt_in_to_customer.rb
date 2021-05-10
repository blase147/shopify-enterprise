class AddOptInToCustomer < ActiveRecord::Migration[6.0]
  def change
    add_column :customers, :opt_in_sent, :boolean, default: false
    add_column :customers, :opt_in_reminder_at, :datetime
  end
end
