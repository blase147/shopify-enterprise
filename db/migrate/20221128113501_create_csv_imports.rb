class CreateCsvImports < ActiveRecord::Migration[6.0]
  def change
    create_table :csv_imports do |t|
      t.datetime :date_of_import
      t.text :error_logs
      t.references :shop, null: false, foreign_key: true

      t.timestamps
    end
  end
end
