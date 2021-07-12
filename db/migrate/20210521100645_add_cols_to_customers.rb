class AddColsToCustomers < ActiveRecord::Migration[6.0]
  def change
    add_column :customers, :failed_at, :datetime
    add_column :customers, :retry_count, :integer, default: 0
  end
end
