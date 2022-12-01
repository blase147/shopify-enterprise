class CreateAnalyticsData < ActiveRecord::Migration[6.0]
  def change
    create_table :analytics_data do |t|
      t.text :calculated_analytics_data
      t.integer :for_month
      t.references :shop, null: false, foreign_key: true

      t.timestamps
    end
  end
end
