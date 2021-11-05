class AddDisplayNameToBuildABoxCampaign < ActiveRecord::Migration[6.0]
  def change
    add_column :build_a_box_campaigns, :display_name, :string
  end
end
