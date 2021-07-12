class AddPromoDataToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :show_promo_button, :boolean, default: true
    add_column :settings, :promo_button_content, :string
    add_column :settings, :promo_button_url, :string
    add_column :settings, :contact_box_content, :string
    add_column :settings, :promo_tagline1_content, :string
    add_column :settings, :promo_tagline2_content, :string
  end
end
