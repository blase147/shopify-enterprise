class CreateSiteLogs < ActiveRecord::Migration[6.0]
  def up
    return if (table_exists? :site_logs)
    create_table :site_logs do |t|
      t.string :log_type
      t.string :action
      t.string :controller
      t.json :params, default: '{}'
      t.text :message

      t.timestamps
    end
  end

  def down
    drop_table :site_logs if (table_exists? :site_logs)
  end
end
