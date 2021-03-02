class AddReasonsCancelToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :reasons_cancel, :string
  end
end
