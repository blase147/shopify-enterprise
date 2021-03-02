module Mutations
  class DeleteUpsellCampaignGroups < Mutations::BaseMutation
    argument :params, [String], required: true
    field :campaigns, [Types::UpsellCampaignGroupType], null: false

    def resolve(params:)
      UpsellCampaignGroup.destroy(params)

      campaigns = current_shop.upsell_campaign_groups.order(created_at: :desc)
      {campaigns: campaigns}
    rescue ActiveRecord::RecordInvalid => e
      GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
        " #{e.record.errors.full_messages.join(', ')}")
    end
  end
end