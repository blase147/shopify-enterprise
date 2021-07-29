module Mutations
  class UpdateBuildABoxCampaignGroup < Mutations::BaseMutation
    argument :params, Types::Input::BuildABoxCampaignGroupInputType, required: true
    field :campaign, Types::BuildABoxCampaignGroupType, null: false

    def resolve(params:)
      campaign_params = Hash params
      id = params[:id]

      begin
        campaign_params[:build_a_box_campaign_attributes] = campaign_params.delete(:build_a_box_campaign)

        campaign = current_shop.build_a_box_campaign_groups.find_by(id: params[:id])
        campaign.update!(campaign_params)

        { campaign: campaign }
      rescue ActiveRecord::RecordInvalid, ActiveRecord::RecordNotSaved => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
