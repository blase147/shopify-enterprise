module Types
  module Input
    class BuildABoxCampaignGroupInputType < Types::BaseInputObject
      argument :id, String,required: false
      argument :internal_name, String, required: false
      argument :location, String, required: false
      argument :build_a_box_campaign, Types::Input::BuildABoxCampaignInputType, required: true
      argument :__typename , String, required: false
      argument :_destroy, GraphQL::Types::Boolean, required: false
    end
  end
end
