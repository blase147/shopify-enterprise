class CreateDebugMode < ActiveRecord::Migration[6.0]
  def change
    create_table :debug_mode_statuses do |t|
      t.integer :shop_id
      t.boolean :status

      t.timestamps
    end
  end
end
