class CreateAddStripeCustomerMigrations < ActiveRecord::Migration[6.0]
  def change
    create_table :add_stripe_customer_migrations do |t|
      t.json :raw_data
      t.bigint :customer_id

      t.timestamps
    end
  end
end
