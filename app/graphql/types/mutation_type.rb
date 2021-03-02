module Types
  class MutationType < Types::BaseObject
    field :add_plan, mutation: Mutations::AddSellingPlanGroup
    field :update_plan, mutation: Mutations::UpdateSellingPlanGroup
    field :delete_plans, mutation: Mutations::DeleteSellingPlanGroups

    field :update_setting, mutation: Mutations::UpdateSetting

    field :add_installation, mutation: Mutations::AddInstallation
    field :delete_plans, mutation: Mutations::DeleteSellingPlanGroups
    field :add_customer, mutation: Mutations::AddCustomer
    field :add_customers, mutation: Mutations::AddCustomers
    field :update_customer, mutation: Mutations::UpdateCustomer
    field :delete_customers, mutation: Mutations::DeleteCustomers


    field :add_campaign, mutation: Mutations::AddUpsellCampaignGroup
    field :update_campaign, mutation: Mutations::UpdateUpsellCampaignGroup
    field :delete_campaigns, mutation: Mutations::DeleteUpsellCampaignGroups
  end
end
