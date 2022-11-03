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
        errors =  result.data.subscription_billing_attempt_create.nil? ? result.original_hash["errors"][0]["message"] : 
              result.data.subscription_billing_attempt_create.subscription_billing_attempt.error_message.present? ? 
              result.data.subscription_billing_attempt_create.subscription_billing_attempt.error_message : nil

        raise errors if errors.present?

        return { error: nil, data: result.data.subscription_billing_attempt_create.subscription_billing_attempt }
    rescue Exception => ex
        p ex.message
        { error: ex.message }
    end

    def client
        @client ||= ShopifyAPI::GraphQL.client
    end

    def self.charge_store(billing_id, subscription_id, shop)
        if ENV['APP_TYPE'] == 'public'
          billing = SubscriptionBillingAttempService.new(subscription_id).get_attempt(billing_id)
          state = billing.data.subscription_billing_attempt.ready
          if state == true
            subscription = SubscriptionContractService.new(subscription_id).run
            StoreChargeService.new(shop).create_usage_charge(subscription)
          else
            CreateBillingAttemptService.charge_store(billing_id, subscription_id, shop)
          end
        end
    rescue StabdardError => e
        p e.message
    end
    
end