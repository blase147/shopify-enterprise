class AddReferralCodeToCustomerModal < ActiveRecord::Migration[6.0]
  def change
    add_column :customer_modals, :referral_code, :string
  end
end
