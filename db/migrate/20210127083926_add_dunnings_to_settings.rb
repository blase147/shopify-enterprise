class AddDunningsToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :activate_dunning_for_cards, :boolean
    add_column :settings, :dunning_period, :string
    add_column :settings, :retry_frequency, :string
    add_column :settings, :happens_to_subscriptions, :string
    add_column :settings, :happens_to_invoices, :string
    add_column :settings, :dunning_future_trial_subscriptions, :boolean
    add_column :settings, :dunning_one_time_invoice, :boolean
    add_column :settings, :activate_dunning_direct_debit, :boolean
    add_column :settings, :direct_debit_subscription, :string
    add_column :settings, :direct_debit_invoice, :string
    add_column :settings, :dunning_offline_configure, :boolean
    add_column :settings, :dunning_offline_peiod, :string
    add_column :settings, :dunning_offline_subscription, :string
    add_column :settings, :dunning_offline_invoice, :string
    add_column :settings, :dunning_card_configure, :boolean
  end
end
