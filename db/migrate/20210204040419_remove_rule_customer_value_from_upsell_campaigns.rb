class RemoveRuleCustomerValueFromUpsellCampaigns < ActiveRecord::Migration[6.0]
  def change
    remove_column :upsell_campaigns, :rule_customer_value, :string
  end
end
