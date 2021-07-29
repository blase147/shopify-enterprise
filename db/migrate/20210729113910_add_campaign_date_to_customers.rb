class AddCampaignDateToCustomers < ActiveRecord::Migration[6.0]
  def change
    add_column :customers, :campaign_date, :datetime
  end
end
