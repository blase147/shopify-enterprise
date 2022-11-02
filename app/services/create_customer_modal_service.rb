class CreateCustomerModalService
    def self.create(shop_id,customer, contracts=nil)
        id = customer&.id
        id = customer&.id[/\d+/] if id.is_a?(String) && id.include?('SubscriptionContract')
        customer_modal = CustomerModal.find_or_initialize_by(shopify_id: id)
        customer_modal.email = customer.email
        customer_modal.first_name = customer.first_name
        customer_modal.last_name = customer.last_name
        customer_modal.phone = customer.phone
        customer_modal.api_data = customer
        customer_modal.country = customer.default_address&.country
        customer_modal.zip_code = customer.default_address.zip
        customer_modal.city = customer.default_address.city
        customer_modal.address_phone_number = customer.default_address.phone
        customer_modal.state = customer.default_address.province
        customer_modal.contracts.push(contracts&.to_json) unless customer_modal.contracts.include? contracts&.to_json && contract.nil?
        customer_modal.contracts = customer_modal.contracts.compact
        customer_modal.shop_id = shop_id
        customer_modal.save
    end
end