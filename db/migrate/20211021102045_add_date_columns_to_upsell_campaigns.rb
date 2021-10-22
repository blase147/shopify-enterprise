class AddDateColumnsToUpsellCampaigns < ActiveRecord::Migration[6.0]
  def change
    add_column :upsell_campaigns, :selling_plan_ids, :string, array: true
    add_column :upsell_campaigns, :selling_plans, :json
    add_column :upsell_campaigns, :start_date, :date
    add_column :upsell_campaigns, :end_date, :date

    add_index :upsell_campaigns, :selling_plan_ids, using: 'gin'
  end
end
