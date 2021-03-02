class AddRuleCustomerValueToUpsellCampaigns < ActiveRecord::Migration[6.0]
  def change
    add_column :upsell_campaigns, :rule_customer_value, :json
  end
end
