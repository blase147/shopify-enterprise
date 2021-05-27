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
    field :add_smarty_cancellation, mutation: Mutations::AddSmartyCancellation
    field :update_smarty_cancellation, mutation: Mutations::UpdateSmartyCancellation
    field :delete_smarty_cancellation, mutation: Mutations::DeleteSmartyCancellation

    field :add_custom_keyword, mutation: Mutations::AddCustomKeyword
    field :update_custom_keyword, mutation: Mutations::UpdateCustomKeyword
    field :delete_custom_keyword, mutation: Mutations::DeleteCustomKeyword

    field :update_sms_setting, mutation: Mutations::UpdateSmsSetting
    field :update_smarty_message, mutation: Mutations::UpdateSmartyMessage
    field :delete_smarty_message, mutation: Mutations::DeleteSmartyMessage
    field :update_password, mutation: Mutations::UpdatePassword
  end
end
