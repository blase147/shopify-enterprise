class AddIntegrationsTable < ActiveRecord::Migration[6.0]
  def change
    create_table :integrations do |t|
      t.integer :integration_type, default: 0
      t.string :name
      t.string :image_url
      t.json :credentials
      t.integer :status, default: 0
      t.integer :service_type, default: 0
      t.references :shop
      t.boolean :default, default: false
      t.string :keys
      t.timestamps
    end

    add_column :settings, :email_service, :string
  end
end
