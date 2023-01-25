class Referral < ApplicationRecord
  belongs_to :referring_reward_id, class_name: 'ReferralReward'
  belongs_to :referred_reward_id, class_name: 'ReferralReward'
  belongs_to :shop
  validates :referring_reward_id, presence: true, uniqueness: { scope: :shop_id }
  validates :referred_reward_id, presence: true, uniqueness: { scope: :shop_id }
end
