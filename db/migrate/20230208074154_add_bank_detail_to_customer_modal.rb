class AddBankDetailToCustomerModal < ActiveRecord::Migration[6.0]
  def change
    add_column :customer_modals, :bank_detail, :text
  end
end
