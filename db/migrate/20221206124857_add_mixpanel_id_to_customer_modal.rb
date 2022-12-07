class AddMixpanelIdToCustomerModal < ActiveRecord::Migration[6.0]
  def change
    add_column :customer_modals, :mixpanel_id, :string
  end
end
