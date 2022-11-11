class AddCancelLaterPauseLater < ActiveRecord::Migration[6.0]
    def change
      add_column :customer_subscription_contracts, :pause_later, :date
      add_column :customer_subscription_contracts, :cancel_later, :date
      add_column :settings, :pause_later, :string
      add_column :settings, :cancel_later, :string
    end
  end