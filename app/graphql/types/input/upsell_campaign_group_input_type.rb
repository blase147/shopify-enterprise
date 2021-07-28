module Types
  module Input
    class UpsellCampaignGroupInputType < Types::BaseInputObject
      argument :id, String, required: false

      argument :internal_name, String, required: true
      argument :upsell_location, String, required: false
      argument :selector_title, String, required: true
      argument :public_name, String, required: true
      argument :status, String, required: false
      argument :upsell_campaigns, [Types::Input::UpsellCampaignInputType], required: false

      argument :__typename, String, required: false
    end
  end
end
