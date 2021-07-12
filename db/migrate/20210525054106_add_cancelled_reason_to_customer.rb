class AddCancelledReasonToCustomer < ActiveRecord::Migration[6.0]
  def change
    add_reference :customers, :reasons_cancel, foreign_key: true
  end
end
