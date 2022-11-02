class PopulateCustomerModalFromShopify
    include Sidekiq::Worker
    def perform(shop_id)
        Shop.find(shop_id)&.connect
        contracts = GetAllCustomersService.new.all_customers
        contracts = JSON.parse(contracts&.to_json, object_class: OpenStruct)
        contracts&.customers&.each do |contract|
            contract&.each do |customer|
                customer = customer.data.node.customer
                modal_contract = CustomerSubscriptionContract.find_by_shopify_id(customer.id[/\d+/])
                modal_contract = {"subscription": modal_contract.subscription, "status": modal_contract.status}
                CreateCustomerModalService.create(shop_id, customer,modal_contract)
            end
        end
        
    end
end