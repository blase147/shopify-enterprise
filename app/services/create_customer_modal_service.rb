class CreateCustomerModalService
    def self.create(shop_id, customer, contracts=nil)
        begin 
            address = customer.default_address || customer.defaultAddress
            id = customer&.id
            id = customer&.id[/\d+/] if id.is_a?(String) && id.include?('Customer')
            customer_modal = CustomerModal.find_or_initialize_by(shopify_id: id&.to_i)
            customer_modal.email = customer.email
            customer_modal.first_name = customer.first_name || customer.firstName
            customer_modal.last_name = customer.last_name || customer.lastName
            customer_modal.phone = customer.phone
            customer_modal.api_data = customer
            customer_modal.country = address&.country 
            customer_modal.zip_code = address&.zip
            customer_modal.city = address.city
            customer_modal.address_phone_number = address.phone
            customer_modal.state = address.province
            customer_modal.contracts.push(contracts&.to_json) unless customer_modal.contracts.include? contracts&.to_json && contracts.nil?
            customer_modal.contracts = customer_modal.contracts.compact
            customer_modal.shop_id = shop_id
            customer_modal.save
        rescue error
            p error&.to_json
        end
    end
end