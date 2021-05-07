class AddSettingsForSms < ActiveRecord::Migration[6.0]
  def change
    create_table :smarty_messages do |t|
      t.references :shop
      t.string :title
      t.text :description
      t.text :body
      t.boolean :custom, default: false
      t.integer :usage_count, default: 0
      t.timestamps
    end

    create_table :smarty_variables do |t|
      t.references :shop
      t.integer :name
      t.text :response
      t.timestamps
    end

    create_table :sms_settings do |t|
      t.references :shop
      t.integer :status, default: 0
      t.boolean :delay_order, default: false
      t.boolean :edit_delivery_schedule, default: false
      t.boolean :order_tracking, default: false
      t.boolean :renewal_reminder, default: false
      t.boolean :skip_upcoming_order, default: false
      t.boolean :skip_update_next_charge, default: false
      t.boolean :one_time_upsells, default: false
      t.boolean :failed_renewal, default: false
      t.boolean :cancel_reactivate_subscription, default: false
      t.boolean :edit_quantity, default: false
      t.boolean :cancel_subscription, default: false
      t.boolean :winback_flow, default: false
      t.time :delivery_start_time
      t.time :delivery_end_time
      t.string :renewal_duration
      t.timestamps
    end
  end
end
