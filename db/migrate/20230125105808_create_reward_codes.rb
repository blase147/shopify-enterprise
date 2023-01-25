class CreateRewardCodes < ActiveRecord::Migration[6.0]
  def change
    create_table :reward_codes do |t|
      t.string :code
      t.references :customer_modal, null: false, foreign_key: true
      t.boolean :used
      t.references :referral_reward, null: false, foreign_key: true

      t.timestamps
    end
  end
end
