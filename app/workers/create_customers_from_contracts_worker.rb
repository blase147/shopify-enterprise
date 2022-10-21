class CreateCustomersFromContractsWorker
    include Sidekiq::Worker
    def perform
        customers = CustomerSubscriptionContract.all.group_by {|c| c.email}
        customers&.each do |customer|
            email = customer.first
            first_name = customer&.second&.first&.first_name
            last_name = customer&.second&.first&.last_name
            shopify_id = customer&.second&.first&.shopify_customer_id&.to_i
            contracts = []
            customer.second&.each do |c|
                contracts.push({ subscription: "#{c&.subscription}", status: "#{c&.status}"}.to_json)
            end
            CustomerModal.create(email: email, first_name: first_name, last_name: last_name, shopify_id: shopify_id, contracts: contracts)
        end
        
    end
end