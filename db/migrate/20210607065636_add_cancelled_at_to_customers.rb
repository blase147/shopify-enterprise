class AddCancelledAtToCustomers < ActiveRecord::Migration[6.0]
  def change
    add_column :customers, :cancelled_at, :datetime
  end
end
