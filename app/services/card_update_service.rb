class CardUpdateService < GraphqlService
  GET_QUERY = <<-GRAPHQL
    mutation($customerPaymentMethodId: ID!) {
      customerPaymentMethodSendUpdateEmail(customerPaymentMethodId: $customerPaymentMethodId) {
        customer {
          id
        }
        userErrors {
          field
          message
        }
      }
    }

  GRAPHQL

  def initialize id
    @id = id
  end

  def run
    subscription = SubscriptionContractService.new(@id).run
    id = subscription.customer_payment_method.id
    result = client.query(client.parse(GET_QUERY), variables: { customerPaymentMethodId: id} )
    p result

    errors = result.data.customer_payment_method_send_update_email.user_errors
    raise errors.first.message if errors.present?
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end
