class ImportCustomerMigrationWorker
    include Sidekiq::Worker
    sidekiq_options :retry => 3, :dead => false
    def perform(shop_id, customer_migrations)
        current_shop = Shop.find(shop_id)
        current_shop.connect
        customer_migrations = JSON.parse(customer_migrations) rescue nil        
        
        customer_migrations["data"]&.each do |customer_migration|
            @error_logs = nil
            customer_migration = customer_migration&.deep_symbolize_keys

            customer_email = customer_migration[:customer_email]&.strip

            customer = CustomerService.new({shop: current_shop}).get_customer_email(customer_email) rescue nil
            @error_logs = "#{customer_email} doesn't exits" if customer.nil?

            contracts = CustomerSubscriptionContract.where(email: customer_email)&.pluck(:shopify_id) rescue nil
            @error_logs = "#{customer_email} already has contract(s) id - #{contracts&.join(",")}" if contracts.present?
            
            if @error_logs.present?
                current_shop&.csv_imports&.create(date_of_import: Time.current, error_logs: @error_logs, shop_id: current_shop&.id)
            else
                customer_migration[:sellingplangroup] = SellingPlan.find_by_shopify_id(customer_migration[:sellingplan])&.selling_plan_group&.shopify_id

                if customer_migration[:data][:payment_method] == "stripe"
                    @stripe_customer = Stripe::Customer.list({}, api_key: current_shop.stripe_api_key).data.filter{|c| c.email == customer_email}[0]
                    if @stripe_customer.present?
                        AddStripeCustomerMigration.create(raw_data: customer_migration.to_json, customer_id: customer&.id[/\d+/]&.to_i)
                        CustomerService.new({shop: current_shop}).create_customer_payment_remote_method(@stripe_customer&.id,  customer&.id)
                    else
                        error = "#{customer_email} doesn't have stripe account"
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