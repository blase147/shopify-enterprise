class AddNotificationTimeToRebuyMenu < ActiveRecord::Migration[6.0]
    def change
      add_column :rebuy_menus, :notification_time, :string
    end
end