module Types
  class ExportReportLogType < Types::BaseObject
    field :report_type, String, null: true
    field :created_at, String, null: true
    field :start_date, String, null: true
    field :end_date, String, null: true

    def created_at
      object[:created_at].to_datetime.strftime('%b %d %Y, %I:%M %p')
    end

  end
end
