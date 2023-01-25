module Types
  module Input
    class ReferralRewardInputType < Types::BaseInputObject
      argument :id, ID, required: false
      argument :reward_type, String,required: false
      argument :reward_value, String, required: true
      argument :minimum_purchased_amount, String, required: false
      argument :applies_to_collection, String, required: false
      argument :discount_code_prefix, String, required: false
      argument :reward_expiry, String, required: false
      argument :reward_for, String, required: true
    end
  end
end
  