class SetNextBillingDate < GraphqlService
	BILLING_MUTATION = <<-GRAPHQL
    mutation($contractId: ID!, $date: DateTime!) {
		  subscriptionContractSetNextBillingDate(contractId: $contractId, date: $date) {
		    contract {
		      id
		    }
		    userErrors {
		      field
		      message
		    }
		  }
		}
  GRAPHQL

  def initialize(contract_id, date)
    @id = "gid://shopify/SubscriptionContract/#{contract_id}"
    @date = DateTime.parse(date)
    # DateTime.parse("22-4-26")
  end

  def run
  	result = client.query(client.parse(BILLING_MUTATION), variables: { contractId: @id, date: @date} )
  end
end
