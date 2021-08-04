class AddUpsellLocationToUpsellCampaignGroup < ActiveRecord::Migration[6.0]
  def change
    add_column :upsell_campaign_groups, :upsell_location, :string
  end
end
