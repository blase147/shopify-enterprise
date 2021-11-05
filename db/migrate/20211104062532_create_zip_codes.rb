class CreateZipCodes < ActiveRecord::Migration[6.0]
  def change
    create_table :zip_codes do |t|
      t.string :city
      t.string :state
      t.string :codes, array: true
      t.references :shop, null: false, foreign_key: true

      t.timestamps
    end
  end
end
