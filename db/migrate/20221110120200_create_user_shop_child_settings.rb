class CreateUserShopChildSettings < ActiveRecord::Migration[6.0]
  def change
    create_table :user_shop_child_settings do |t|
      t.references :shop
      t.references :user_shop_child
      t.boolean :dashboard_access, default: false
      t.boolean :manage_plan_access, default: false
      t.boolean :subscription_orders_access, default: false
      t.boolean :analytics_access, default: false
      t.boolean :installation_access, default: false
      t.boolean :tiazen_access, default: false
      t.boolean :toolbox_access, default: false
      t.boolean :settings_access, default: false

      t.timestamps
    end
  end
end