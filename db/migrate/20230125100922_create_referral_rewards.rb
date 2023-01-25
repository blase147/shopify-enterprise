class CreateReferralRewards < ActiveRecord::Migration[6.0]
  def change
    create_table :referral_rewards do |t|
      t.text :reward_type
      t.float :reward_value
      t.string :applies_to_collection
      t.float :minimum_purchased_amount
      t.string :discount_code_prefix
      t.date :reward_expiry

      t.timestamps
    end
  end
end
