class ImportCustomerMigrationWorker
    include Sidekiq::Worker
    sidekiq_options :retry => 3, :dead => false
    def perform(shop_id, customer_migrations)
        current_shop = Shop.find(shop_id)
        current_shop.connect
        customer_migrations = JSON.parse(customer_migrations) rescue nil
        customer = CustomerService.new({shop: current_shop}).get_customer(customer_migration[:customer_id][/\d+/])
        contracts = CustomerSubscriptionContract.where(email: customer&.email)&.pluck(:shopify_id) rescue nil
        if contracts.present?
            error_logs = "#{customer&.email} already has contract(s) id - #{contracts&.join(",")}"
            current_shop&.csv_imports&.create(date_of_import: Time.current, error_logs: error_logs, shop_id: current_shop&.id)
        else
            customer_migrations["data"]&.each do |customer_migration|
                customer_migration = customer_migration&.deep_symbolize_keys
                if customer_migration[:data][:payment_method] == "stripe"
                    @stripe_customer = Stripe::Customer.list({}, api_key: current_shop.stripe_api_key).data.filter{|c| c.email == customer.email}[0]
                    if @stripe_customer.present?
                        AddStripeCustomerMigration.create(raw_data: customer_migration.to_json, customer_id: customer_migration[:customer_id][/\d+/]&.to_i)
                        CustomerService.new({shop: current_shop}).create_customer_payment_remote_method(@stripe_customer&.id, customer_migration[:customer_id])
                    else
                        error = "#{customer&.email} doesn't have stripe account"
                        current_shop&.csv_imports&.create(date_of_import: Time.current, error_logs: error, shop_id: current_shop&.id)
                    end
                else
                    customer_migration = customer_migration.deep_stringify_keys
                    contract = SubscriptionContractDraftService.new(customer_migration).fetch_customer
                end
            end
        end
    end
end