class GenerateAccountActivationUrl < GraphqlService
  QUERY = <<-GRAPHQL
    mutation ($customerId: ID!) {
      customerGenerateAccountActivationUrl(customerId: $customerId) {
        accountActivationUrl
        userErrors {
          field
          message
        }
      }
    }
  GRAPHQL

  def initialize(customer_id)
    @customer_id = customer_id
  end

  def generate
    result = client.query(client.parse(QUERY), variables: { customerId: "gid://shopify/Customer/#{@customer_id}"  })
    result.data.customer_generate_account_activation_url.account_activation_url rescue nil
  end
end
