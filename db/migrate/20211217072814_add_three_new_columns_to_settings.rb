class AddThreeNewColumnsToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :day_of_production, :string
    add_column :settings, :delivery_interval_after_production, :string
    add_column :settings, :eligible_weekdays_for_delivery , :string
  end
end
