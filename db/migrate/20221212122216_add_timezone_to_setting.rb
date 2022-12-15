class AddTimezoneToSetting < ActiveRecord::Migration[6.0]
    def change
      add_column :settings, :timezone, :string
    end
end