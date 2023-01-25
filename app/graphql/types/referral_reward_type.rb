module Types
    class ReferralRewardType < Types::BaseObject
        field :id, ID, null: true
        field :active, Boolean, null: true
        field :reward_type, String, null: true
        field :reward_value, String, null: true
        field :applies_to_collection, String, null: true
        field :minimum_purchased_amount, String, null: true
        field :discount_code_prefix, String, null: true
        field :reward_expiry, String, null: true
    end
end
  