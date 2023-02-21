class AddOrderToCurvosModel < ActiveRecord::Migration[6.0]
  def change
    add_column :curvos_models, :order_id, :string
  end
end
  