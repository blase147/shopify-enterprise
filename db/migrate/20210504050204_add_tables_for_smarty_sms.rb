class AddTablesForSmartySms < ActiveRecord::Migration[6.0]
  def change
    create_table :sms_conversations do |t|
      t.references :customer
      t.integer :status, default: 0
      t.datetime :last_activity_at
      t.string :command
      t.integer :command_step, default: 0
      t.json :command_data
      t.timestamps
    end

    create_table :sms_messages do |t|
      t.references :sms_conversation
      t.string :from_number
      t.string :to_number
      t.boolean :comes_from_customer
      t.text :content
      t.string :command
      t.integer :command_step, default: 0
      t.json :command_data
      t.timestamps
    end

    create_table :smarty_cancellation_reasons do |t|
      t.string :name
      t.integer :winback, default: 0
      t.references :shop
      t.timestamps
    end

    create_table :custom_keywords do |t|
      t.text :response
      t.text :keywords, array: true, default: []
      t.integer :status, default: 0
      t.references :shop
      t.timestamps
    end
  end
end
