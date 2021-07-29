module Mutations
  class AddBuildABoxCampaignGroup < Mutations::BaseMutation
    argument :params, Types::Input::BuildABoxCampaignGroupInputType, required: true
    field :campaign, Types::BuildABoxCampaignGroupType, null: false

    def resolve(params:)
      campaign_params = Hash params
      campaign_params[:build_a_box_campaign_attributes] = campaign_params.delete(:build_a_box_campaign)
      begin
        campaign = current_shop.build_a_box_campaign_groups.create!(campaign_params)
        { campaign: campaign }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
