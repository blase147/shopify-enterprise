class AddContentToSmsFlows < ActiveRecord::Migration[6.0]
  def change
    add_column :sms_flows, :content, :json
  end
end
