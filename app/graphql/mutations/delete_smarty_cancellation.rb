module Mutations
  class DeleteSmartyCancellation < Mutations::BaseMutation
    argument :id, String, required: true
    field :smarty_cancellation_reason, Types::SmartyCancellationReasonType, null: false

    def resolve(id:)
      begin
        smarty_cancellation_reason = current_shop.smarty_cancellation_reasons.find_by(id: id)
        smarty_cancellation_reason.destroy
        { smarty_cancellation_reason: smarty_cancellation_reason }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
