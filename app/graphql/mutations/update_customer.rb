module Mutations
  class UpdateCustomer < Mutations::BaseMutation
    argument :params, Types::Input::CustomerSubscriptionInputType, required: true
    field :customer, Types::CustomerSubscriptionType, null: false

    def resolve(params:)
      customer_params = Hash params
      id = params[:id]

      begin

        customer_params[:additional_contacts_attributes] = customer_params.delete(:additional_contacts)
        customer_params[:billing_address_attributes] = customer_params.delete(:billing_address)
        # byebug
        customer = current_shop.customer_subscription_contracts.find_by(id: params[:id])
        customer.update!(customer_params)
        { customer: customer }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
