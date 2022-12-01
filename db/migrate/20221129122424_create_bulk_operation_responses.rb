class CreateBulkOperationResponses < ActiveRecord::Migration[6.0]
  def change
    create_table :bulk_operation_responses do |t|
      t.string :response_type
      t.string :api_raw_data
      t.references :shop, null: false, foreign_key: true

      t.timestamps
    end
  end
end
