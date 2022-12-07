class AddMixpanelIdToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :mixpanel_id, :string
  end
end
