module Mutations
  class AddReferralReward < Mutations::BaseMutation
    argument :params, Types::Input::ReferralRewardInputType, required: true
    field :referral_reward, Types::ReferralRewardType, null: false
    
    def resolve(params:)

      params = Hash params
      begin
        if params[:id].present?
          referral_reward = ReferralReward.find(params[:id])
          referral_reward.update(params)
        else
          referral = Referral.find_or_initialize_by(shop_id: current_shop.id).save
          referral_reward = ReferralReward.create!(params)
          #update referral table
          if params[:reward_for] == "referring"
            referral.update(referring_reward_id: referral_reward&.id)
          elsif params[:reward_for] == "referrer"
            referral.update(referred_reward_id: referral_reward&.id)
          end
        end

        { referral_reward: referral_reward }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end

    end
  end
end
