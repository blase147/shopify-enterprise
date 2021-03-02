module Mutations
  class UpdateUpsellCampaignGroup < Mutations::BaseMutation
    argument :params, Types::Input::UpsellCampaignGroupInputType, required: true
    field :campaign, Types::UpsellCampaignGroupType, null: false

    def resolve(params:)
      campaign_params = Hash params
      id = params[:id]

      begin
        campaign_params[:upsell_campaigns_attributes] = campaign_params.delete(:upsell_campaigns)

        campaign = current_shop.upsell_campaign_groups.find_by(id: params[:id])
        campaign.update!(campaign_params)

        { campaign: campaign }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end