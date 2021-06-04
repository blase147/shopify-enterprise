class CreateReportLogs < ActiveRecord::Migration[6.0]
  def change
    create_table :report_logs do |t|
      t.integer :report_type
      t.date :start_date
      t.date :end_date

      t.timestamps
    end
  end
end
