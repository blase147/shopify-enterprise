module Types
  class QueryType < Types::BaseObject
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
  end
end
