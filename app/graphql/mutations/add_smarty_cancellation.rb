module Mutations
  class AddSmartyCancellation < Mutations::BaseMutation
    argument :params, Types::Input::SmartyCancellationInputType, required: true
    field :smarty_cancellation_reason, Types::SmartyCancellationReasonType, null: false

    def resolve(params:)
      cancellation_params = Hash params

      begin
        smarty_cancellation_reason = current_shop.smarty_cancellation_reasons.create!(cancellation_params)
        { smarty_cancellation_reason: smarty_cancellation_reason }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
