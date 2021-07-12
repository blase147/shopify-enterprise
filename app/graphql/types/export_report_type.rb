module Types
  class ExportReportType < Types::BaseObject
    field :products, [Types::ExportProductType], null: true
    field :customers, [Types::ExportCustomerType], null: true
    field :report_logs, [Types::ExportReportLogType], null: true
  end
end
