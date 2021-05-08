module Types
  class QueryType < Types::BaseObject
    add_field(GraphQL::Types::Relay::NodeField)
    field :fetch_plan_groups, resolver: Queries::FetchSellingPlanGroups
    field :fetch_plan_group, resolver: Queries::FetchSellingPlanGroup
    field :fetch_setting, resolver: Queries::FetchSetting
    field :fetch_themes, resolver: Queries::FetchThemes
    field :fetch_customers, resolver: Queries::FetchCustomers
    field :fetch_customer, resolver: Queries::FetchCustomer

    field :fetch_campaigns, resolver: Queries::FetchUpsellCampaignGroups
    field :fetch_campaign, resolver: Queries::FetchUpsellCampaignGroup
    field :fetch_selling_plan_by_name, resolver: Queries::FetchSellingPlanByName
    field :fetch_dashboard_report, resolver: Queries::FetchDashboardReport
    field :fetch_revenue_trend, resolver: Queries::FetchRevenueTrend
    field :fetch_smarty_cancellation_reasons, resolver: Queries::FetchSmartyCancellationReasons
    field :fetch_smarty_cancellation_reason, resolver: Queries::FetchSmartyCancellationReason
    field :fetch_custom_keywords, resolver: Queries::FetchCustomKeywords
    field :fetch_custom_keyword, resolver: Queries::FetchCustomKeyword
    field :fetch_sms_setting, resolver: Queries::FetchSmsSetting
    field :fetch_smarty_messages, resolver: Queries::FetchSmartyMessages
    field :fetch_smarty_message, resolver: Queries::FetchSmartyMessage
    field :fetch_smarty_variables, resolver: Queries::FetchSmartyVariables
  end
end
