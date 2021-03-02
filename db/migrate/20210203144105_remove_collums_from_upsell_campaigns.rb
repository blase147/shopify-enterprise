class RemoveCollumsFromUpsellCampaigns < ActiveRecord::Migration[6.0]
  def change
    remove_column :upsell_campaigns, :product_name, :string
    remove_column :upsell_campaigns, :product_value, :string
    remove_column :upsell_campaigns, :rule_cart_value, :string
  end
end
