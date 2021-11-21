module Mutations
  class AddCustomers < Mutations::BaseMutation
    argument :params, [Types::Input::CustomerSubscriptionInputType], required: true
    field :result, String, null: false

    def resolve(params:)
      begin
        # byebug
        customers = []
        params.each do |item|
          customer_params =  Hash item
          customer_params[:additional_contacts_attributes] = customer_params.delete(:additional_contacts)
          customer_params[:billing_address_attributes] = customer_params.delete(:billing_address)
          # customer = current_shop.customers.create!(customer_params)
          customers << customer_params
        end
        ActiveRecord::Base.transaction do
          customer =  current_shop.customer_subscription_contracts.create!(customers)
        end
        {result: "OK"}
      rescue  ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
        raise ActiveRecord::Rollback, "Import fail, data error, please check csv file!"
      end
    end
  end
end
