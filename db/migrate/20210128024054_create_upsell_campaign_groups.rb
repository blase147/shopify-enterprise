class CreateUpsellCampaignGroups < ActiveRecord::Migration[6.0]
  def change
    create_table :upsell_campaign_groups do |t|
      t.string :internal_name
      t.string :selector_title
      t.string :public_name
      t.integer :status
      t.integer :shop_id

      t.timestamps
    end
  end
end
