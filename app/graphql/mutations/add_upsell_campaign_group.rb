module Mutations
  class AddUpsellCampaignGroup < Mutations::BaseMutation
    argument :params, Types::Input::UpsellCampaignGroupInputType, required: true
    field :campaign, Types::UpsellCampaignGroupType, null: false

    def resolve(params:)
      campaign_params = Hash params
      campaign_params[:upsell_campaigns_attributes] = campaign_params.delete(:upsell_campaigns)

      begin
        campaign = current_shop.upsell_campaign_groups.create!(campaign_params)
        { campaign: campaign }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end