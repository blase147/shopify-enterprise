module Mutations
    class DeleteBuildABoxCampaignGroup < Mutations::BaseMutation
      argument :params, [String], required: true
      field :build_a_box_campaign_groups, [Types::BuildABoxCampaignGroupType], null: false

      def resolve(params:)
        campaign_params = params

        begin
           BuildABoxCampaignGroup.destroy(campaign_params)
           build_a_box_campaign_groups = current_shop.build_a_box_campaign_groups.order(created_at: :desc)
           {build_a_box_campaign_groups: build_a_box_campaign_groups}
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
            " #{e.record.errors.full_messages.join(', ')}")
        end
      end
    end
  end
