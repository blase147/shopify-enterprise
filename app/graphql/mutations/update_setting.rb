module Mutations
  class UpdateSetting < Mutations::BaseMutation
    argument :params, Types::Input::SettingInputType, required: true
    field :setting, Types::SettingType, null: false

    def resolve(params:)
      setting_params = Hash params

      begin
        setting_params[:email_notifications_attributes] = setting_params.delete(:email_notifications)
        setting_params[:reasons_cancels_attributes] = setting_params.delete(:reasons_cancels)
        setting = current_shop.setting
        setting.update!(setting_params)

        { setting: setting }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
