module Queries
  class FetchReportLog < Queries::BaseQuery
    type Types::ExportReportType, null: true
    argument :start_date, String, required: true
    argument :end_date, String, required: true

    def resolve(start_date:, end_date:)
      range = start_date.to_date..end_date.to_date
      report_logs = ReportLog.where(created_at: range)
      {report_logs: report_logs}
    end

  end
end
