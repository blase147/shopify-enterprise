class ReferralReward < ApplicationRecord
    has_many :referrers, class_name: "Referral", foreign_key: :referring_reward_id
    has_many :referreds, class_name: "Referral", foreign_key: :referred_reward_id
    has_many :reward_codes, dependent: :destroy

    enum :reward_type=>{ "Amount Discount": "amount", "Percentage Off": "percentage", "Points": "points"}
end
