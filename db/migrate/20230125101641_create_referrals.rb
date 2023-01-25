class CreateReferrals < ActiveRecord::Migration[6.0]
  def change
    create_table :referrals do |t|
      t.boolean :active
      t.text :guest_nudge
      t.text :tweet_message
      t.text :facebook_message
      t.references :shop, null: false, foreign_key: true
      t.bigint :referring_reward_id, null: true
      t.bigint :referred_reward_id, null: true
      t.index :referring_reward_id,name: :referring_reward_id
      t.index :referred_reward_id,name: :referred_reward_id

      t.timestamps
    end
    add_foreign_key :referrals, :referral_rewards, column: :referring_reward_id
    add_foreign_key :referrals, :referral_rewards, column: :referred_reward_id
  end
end
