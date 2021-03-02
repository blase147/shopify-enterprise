class CreateSettings < ActiveRecord::Migration[6.0]
  def change
    create_table :settings do |t|
      t.integer :shop_id
      t.integer :payment_retries
      t.integer :payment_delay_retries
      t.boolean :cancel_enabled
      t.boolean :pause_resume
      t.boolean :attempt_billing
      t.boolean :skip_payment
      t.boolean :show_after_checkout

      t.timestamps
    end
  end
end
