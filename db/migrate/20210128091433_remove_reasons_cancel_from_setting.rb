class RemoveReasonsCancelFromSetting < ActiveRecord::Migration[6.0]
  def change
    remove_column :settings, :reasons_cancel, :string
  end
end
