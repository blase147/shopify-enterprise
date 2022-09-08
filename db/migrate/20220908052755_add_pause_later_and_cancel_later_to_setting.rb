class AddPauseLaterAndCancelLaterToSetting < ActiveRecord::Migration[6.0]
  def change
    add_column :settings, :pause_later, :string
    add_column :settings, :cancel_later, :string
  end
end
