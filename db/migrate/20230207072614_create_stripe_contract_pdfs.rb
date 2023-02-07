class CreateStripeContractPdfs < ActiveRecord::Migration[6.0]
  def change
    create_table :stripe_contract_pdfs do |t|
      t.references :shop, null: false, foreign_key: true

      t.timestamps
    end
  end
end
