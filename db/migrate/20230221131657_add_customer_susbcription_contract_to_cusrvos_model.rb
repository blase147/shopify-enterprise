class AddCustomerSusbcriptionContractToCusrvosModel < ActiveRecord::Migration[6.0]
  def change
    add_reference :curvos_models, :customer_subscription_contract, foreign_key: true, null: true
  end
end
