class AddPhoneToBillingAddresses < ActiveRecord::Migration[6.0]
  def change
    add_column :billing_addresses, :phone, :string
  end
end
