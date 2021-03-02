class RemoveCheckoutSubscriptionTermsFromSettings < ActiveRecord::Migration[6.0]
  def change
    remove_column :settings, :checkout_subscription_terms, :text
    remove_column :settings, :email_subscription_terms, :text
    remove_column :settings, :apple_pay_subscription_terms, :text
  end
end
