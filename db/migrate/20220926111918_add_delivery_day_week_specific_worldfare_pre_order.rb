class AddDeliveryDayWeekSpecificWorldfarePreOrder < ActiveRecord::Migration[6.0]
  def change
    add_column :worldfare_pre_orders, :delivery_day_week_specific, :string
  end
end
