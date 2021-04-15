class AddSettingsForCustomizeStyles < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :style_account_profile, :text
    add_column :settings, :style_sidebar, :text
    add_column :settings, :style_subscription, :text
    add_column :settings, :style_sidebar_pages, :text
    add_column :settings, :style_upsell, :text
  end
end
