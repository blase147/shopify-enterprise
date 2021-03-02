class ChangeUpsellCampaignColumnType < ActiveRecord::Migration[6.0]
  def change
    change_column :upsell_campaigns, :button_text_accept, :string
    change_column :upsell_campaigns, :button_text_decline, :string
  end
end
