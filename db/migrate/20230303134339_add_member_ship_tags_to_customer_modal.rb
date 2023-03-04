class AddMemberShipTagsToCustomerModal < ActiveRecord::Migration[6.0]
    def change
      add_column :customer_modals, :membership_tags, :text, array: true, default: []
    end
end