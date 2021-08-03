class CreditCardUpdateService < GraphqlService
  CREATE_QUERY = <<-GRAPHQL
  mutation($id: ID!, $billingAddress: MailingAddressInput!, $sessionId: String!) {
    customerPaymentMethodCreditCardUpdate(id: $id, billingAddress: $billingAddress, sessionId: $sessionId
    ) {
      customerPaymentMethod {
        id
      }
      userErrors {
        field
        message
      }
    }
  }

  GRAPHQL

  def initialize(id, session_id, params)
    @id = id
    @session_id = session_id
    @params = params
  end

  def run
    subscription = SubscriptionContractService.new(@id).run
    id = subscription.customer_payment_method.id
    result = client.query(client.parse(CREATE_QUERY), variables: { id: id, sessionId: @session_id, billingAddress: billing_params} )
    p result

    errors = result.data.customer_payment_method_credit_card_update.user_errors
    raise errors.first.message if errors.present?
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def billing_params
    {
      firstName: @params[:address_first_name],
      lastName: @params[:address_last_name],
      address1: @params[:address],
      country: @params[:address_country],
      city: @params[:address_city],
      province: @params[:address_state],
      zip: @params[:address_zip]
    }
  end
end
