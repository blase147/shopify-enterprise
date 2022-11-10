 module Types
  class QueryType < Types::BaseObject
    field :fetch_plan_groups, resolver: Queries::FetchSellingPlanGroups
    field :fetch_plan_group, resolver: Queries::FetchSellingPlanGroup
    field :fetch_setting, resolver: Queries::FetchSetting
    field :fetch_themes, resolver: Queries::FetchThemes
    field :fetch_customers, resolver: Queries::FetchCustomers
    field :fetch_customer_model, resolver: Queries::FetchCustomerModel
    field :fetch_customer, resolver: Queries::FetchCustomer
    field :fetch_staff_members, resolver: Queries::FetchStaffMembers
    field :fetch_ways_to_earn_point, resolver: Queries::FetchWaysToEarnPoint

    field :fetch_campaigns, resolver: Queries::FetchUpsellCampaignGroups
    field :fetch_campaign, resolver: Queries::FetchUpsellCampaignGroup
    field :fetch_selling_plan_by_name, resolver: Queries::FetchSellingPlanByName
    field :fetch_dashboard_report, resolver: Queries::FetchDashboardReport
    field :fetch_power_plan_group, resolver: Queries::FetchPowerPlanGroup
    field :fetch_revenue_trend, resolver: Queries::FetchRevenueTrend
    field :fetch_report, resolver: Queries::FetchReport
    field :fetch_report_log, resolver: Queries::FetchReportLog
    field :fetch_smarty_cancellation_reasons, resolver: Queries::FetchSmartyCancellationReasons
    field :fetch_smarty_cancellation_reason, resolver: Queries::FetchSmartyCancellationReason
    field :fetch_custom_keywords, resolver: Queries::FetchCustomKeywords
    field :fetch_custom_keyword, resolver: Queries::FetchCustomKeyword
    field :fetch_sms_setting, resolver: Queries::FetchSmsSetting
    field :fetch_smarty_messages, resolver: Queries::FetchSmartyMessages
    field :fetch_smarty_message, resolver: Queries::FetchSmartyMessage
    field :fetch_smarty_variables, resolver: Queries::FetchSmartyVariables
    field :fetch_customer_insights, resolver: Queries::FetchCustomerInsights
    field :confirm_password, resolver: Queries::ConfirmPassword
    field :fetch_integrations, resolver: Queries::FetchIntegrations
    field :fetch_integration, resolver: Queries::FetchIntegration
    field :fetch_sms_analytics, resolver: Queries::FetchSmsAnalytics
    field :fetch_subscription_logs, resolver: Queries::FetchSubscriptionLogs
    field :fetch_translation, resolver: Queries::FetchTranslation
    field :fetch_build_a_box_campaign_group, resolver: Queries::FetchBuildABoxCampaignGroup
    field :fetch_build_a_box_campaign_groups, resolver: Queries::FetchBuildABoxCampaignGroups
    field :fetch_ship_engine_orders, resolver: Queries::FetchShipEngineOrders
    field :fetch_customers_meals_orders, resolver: Queries::FetchCustomersMealsOrders
    field :fetch_delivery_options, resolver: Queries::FetchDeliveryOptions
    field :fetch_ship_engine_order, resolver: Queries::FetchShipEngineOrder
    field :fetch_estimated_shipping_rates, resolver: Queries::FetchEstimatedShippingRates
    field :fetch_weekly_menu, resolver: Queries::FetchWeeklyMenu
    field :fetch_weekly_menus, resolver: Queries::FetchWeeklyMenus
  end
end
