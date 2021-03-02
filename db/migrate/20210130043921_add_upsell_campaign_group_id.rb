class AddUpsellCampaignGroupId < ActiveRecord::Migration[6.0]
  def change
    add_column :upsell_campaigns, :upsell_campaign_group_id, :integer
    remove_column :upsell_campaigns, :shop_id
  end
end
