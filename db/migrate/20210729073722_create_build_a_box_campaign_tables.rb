class CreateBuildABoxCampaignTables < ActiveRecord::Migration[6.0]
  def change
    create_table :build_a_box_campaign_groups do |t|
      t.references :shop
      t.string :internal_name
      t.string :location
      t.timestamps
    end

    create_table :build_a_box_campaigns do |t|
      t.references :build_a_box_campaign_group
      t.date :start_date
      t.date :end_date
      t.integer :box_quantity_limit
      t.integer :box_subscription_type
      t.json :collection_images
      t.json :product_images
      t.json :triggers
      t.json :selling_plans
      t.timestamps
    end
  end
end
