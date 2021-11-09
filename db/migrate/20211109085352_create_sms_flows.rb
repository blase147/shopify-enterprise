class CreateSmsFlows < ActiveRecord::Migration[6.0]
  def change
    create_table :sms_flows do |t|
      t.string :name, null: false
      t.integer :sent, default: 0
      t.integer :clicks, default: 0
      t.decimal :revenue, default: 0
      t.boolean :status, default: false
      t.text :description
      t.references :shop, null: false, foreign_key: true

      t.timestamps
    end
  end
end
