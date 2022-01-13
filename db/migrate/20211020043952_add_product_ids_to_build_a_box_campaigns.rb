class AddProductIdsToBuildABoxCampaigns < ActiveRecord::Migration[6.0]
  def change
    add_column :build_a_box_campaigns, :selling_plan_ids, :string, array: true

    add_index :build_a_box_campaigns, :selling_plan_ids, using: 'gin'
  end
end
