class AddTriggerTypeToSmsFlow < ActiveRecord::Migration[6.0]
  def change
    add_column :sms_flows, :trigger, :string
  end
end
