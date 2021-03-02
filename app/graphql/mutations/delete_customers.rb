module Mutations
  class DeleteCustomers < Mutations::BaseMutation
    argument :params, [String], required: true
    field :result, String, null: false

    def resolve(params:)
      customer_params = params

      begin
         Customer.destroy(customer_params)
         {result: "ok"}
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end