module Mutations
  class UpdateSmartyMessage < Mutations::BaseMutation
    argument :params, Types::Input::SmartyMessageInputType, required: true
    field :smarty_message, Types::SmartyMessageType, null: false

    def resolve(params:)
      smarty_message_params = Hash params
      begin
        smarty_message = current_shop.smarty_messages.find(params[:id])
        if smarty_message.present? && smarty_message.custom
          smarty_message.update!(smarty_message_params.except(:id))
        else
          smarty_message = smarty_message.dup
          smarty_message.assign_attributes(smarty_message_params.except(:id).merge(custom: true))
          smarty_message.save
        end
        { smarty_message: smarty_message }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
