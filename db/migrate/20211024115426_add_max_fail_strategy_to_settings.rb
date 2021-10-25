class AddMaxFailStrategyToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :max_fail_strategy, :string
  end
end
