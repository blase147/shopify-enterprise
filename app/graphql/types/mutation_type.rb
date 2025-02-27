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
    field :add_ways_to_earn_points, mutation: Mutations::AddWaysToEarnPoints
    field :add_referral_reward, mutation: Mutations::AddReferralReward
    field :add_subscription_product, mutation: Mutations::AddSubscriptionProduct


    field :add_campaign, mutation: Mutations::AddUpsellCampaignGroup
    field :update_campaign, mutation: Mutations::UpdateUpsellCampaignGroup
    field :delete_campaigns, mutation: Mutations::DeleteUpsellCampaignGroups
    field :add_weekly_menu, mutation: Mutations::AddWeeklyMenu
    field :update_weekly_menu, mutation: Mutations::UpdateWeeklyMenu
    field :delete_weekly_menus, mutation: Mutations::DeleteWeeklyMenus

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
    field :add_bundle_menu, mutation: Mutations::AddBundleMenu
    field :add_rebuy_menu, mutation: Mutations::AddRebuyMenu
    field :add_membership, mutation: Mutations::AddMembership

    field :update_integration, mutation: Mutations::UpdateIntegration
    field :update_translation, mutation: Mutations::UpdateTranslation

    field :add_box_campaign, mutation: Mutations::AddBuildABoxCampaignGroup
    field :delete_box_campaigns, mutation: Mutations::DeleteBuildABoxCampaignGroup
    field :update_box_campaign, mutation: Mutations::UpdateBuildABoxCampaignGroup
    field :update_ship_engine_order, mutation: Mutations::UpdateShipEngineOrder
  end
end
