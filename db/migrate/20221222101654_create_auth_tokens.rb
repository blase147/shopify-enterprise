class CreateAuthTokens < ActiveRecord::Migration[6.0]
  def change
    create_table :auth_tokens do |t|
      t.string :token
      t.references :customer_modal, null: false, foreign_key: true

      t.timestamps
    end
  end
end
