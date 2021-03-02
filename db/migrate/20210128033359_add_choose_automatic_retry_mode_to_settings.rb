class AddChooseAutomaticRetryModeToSettings < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :choose_automatic_retry_mode, :string
  end
end
