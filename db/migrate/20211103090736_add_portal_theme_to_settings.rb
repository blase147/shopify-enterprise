class AddPortalThemeToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :portal_theme, :string
  end
end
