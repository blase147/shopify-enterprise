class AddColumnToUpsellCampaigns < ActiveRecord::Migration[6.0]
  def change
    add_column :upsell_campaigns, :rule_cart_value, :json
    add_column :upsell_campaigns, :product_offer, :json
  end
end
