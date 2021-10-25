class AddActiveSubscriptionBtnSeqToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :active_subscription_btn_seq, :string, array: true
  end
end
