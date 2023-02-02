module Queries
  class FetchReportLog < Queries::BaseQuery
    type Types::ExportReportType, null: true
    argument :start_date, String, required: true
    argument :end_date, String, required: true
    argument :shop_domain, String, required: false

    def resolve(start_date:, end_date:, shop_domain:)
      current_shop = Shop.find_by_shopify_domain(shop_domain) rescue current_shop
      range = Time.current-2.hours..Time.current
      report_logs = ReportLog.where(created_at: range)
      {report_logs: report_logs}
    end

  end
end
