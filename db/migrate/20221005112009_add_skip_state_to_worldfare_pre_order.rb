class AddSkipStateToWorldfarePreOrder < ActiveRecord::Migration[6.0]
  def change
    add_column :worldfare_pre_orders, :skip_state, :string
  end
end
