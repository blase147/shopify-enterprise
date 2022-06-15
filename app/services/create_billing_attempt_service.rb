class CreateBillingAttemptService < GraphqlService
    CREATE_MUTATION = <<-GRAPHQL
        mutation ($subscription_contract_id: ID!, $key: String!){
        subscriptionBillingAttemptCreate(
            subscriptionContractId: $subscription_contract_id
            subscriptionBillingAttemptInput: { idempotencyKey: $key }
        ) {
            subscriptionBillingAttempt {
            id
            errorMessage
            nextActionUrl
            order {
                id
            }
            ready
            }
        }
        }
    GRAPHQL

    def run(contract_id)
        contract = CustomerSubscriptionContract.find contract_id
        contract_id = "gid://shopify/SubscriptionContract/#{contract.shopify_id}"
        contract.shop.connect

        result = client.query(client.parse(CREATE_MUTATION), variables: {
            subscription_contract_id: contract_id,
            key: Time.current.to_i.to_s
        })        
    end

    def client
        @client ||= ShopifyAPI::GraphQL.client
    end
end