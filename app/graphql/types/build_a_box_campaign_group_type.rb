module Types
  class BuildABoxCampaignGroupType < Types::BaseObject
    field :id, ID, null: false
    field :internal_name, String, null: true
    field :location, String, null: true
    field :build_a_box_campaign, Types::BuildABoxCampaignType, null: true
    field :__typename, String, null: true
    field :_destroy, GraphQL::Types::Boolean, null: false
  end
end
