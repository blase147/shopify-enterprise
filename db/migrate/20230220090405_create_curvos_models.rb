class CreateCurvosModels < ActiveRecord::Migration[6.0]
  def change
    create_table :curvos_models do |t|
      t.string :mix_panel_id
      t.string :customer_shopify_id
      t.string :status
      t.string :variants, array: true, default: []

      t.timestamps
    end
  end
end
