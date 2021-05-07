module Mutations
  class UpdateSmsSetting < Mutations::BaseMutation
    argument :params, Types::Input::SmsSettingInputType, required: true
    field :sms_setting, Types::SmsSettingType, null: false

    def resolve(params:)
      sms_setting_params = Hash params
      begin
        sms_setting = current_shop.sms_setting
        sms_setting.update!(sms_setting_params.except(:id))
        { sms_setting: sms_setting }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
