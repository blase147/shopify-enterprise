class AddLegalParamsToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :checkout_subscription_terms, :text
    add_column :settings, :email_subscription_terms, :text
    add_column :settings, :apple_pay_subscription_terms, :text
  end
end
