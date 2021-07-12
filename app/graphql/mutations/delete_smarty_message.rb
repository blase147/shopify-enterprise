module Mutations
  class DeleteSmartyMessage < Mutations::BaseMutation
    argument :id, String, required: true
    field :smarty_message, Types::SmartyMessageType, null: false

    def resolve(id:)
      begin
        smarty_message = current_shop.smarty_messages.where(id: id, custom: true).last
        smarty_message.destroy
        { smarty_message: smarty_message }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
