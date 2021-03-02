module Mutations
  class AddCustomer < Mutations::BaseMutation
    argument :params, Types::Input::CustomerSubscriptionInputType, required: true
    field :customer, Types::CustomerSubscriptionType, null: false

    def resolve(params:)
      customer_params = Hash params
      customer_params[:additional_contacts_attributes] = customer_params.delete(:additional_contacts)
      customer_params[:billing_address_attributes] = customer_params.delete(:billing_address)

      begin
        customer = current_shop.customers.create!(customer_params)
        { customer: customer }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end