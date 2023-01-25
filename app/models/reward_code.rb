class RewardCode < ApplicationRecord
  belongs_to :customer_modal
  belongs_to :referral_reward
end
