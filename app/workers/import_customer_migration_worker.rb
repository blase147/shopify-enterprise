class ImportCustomerMigrationWorker
    include Sidekiq::Worker
    sidekiq_options :retry => 3, :dead => false
    def perform(shop_id, customer_migrations)
        current_shop = Shop.find(shop_id)
        current_shop.connect
        customer_migrations = JSON.parse(customer_migrations) rescue nil
        customer_migrations["data"]&.each do |customer_migration|
            customer_migration = customer_migration&.deep_symbolize_keys
            if customer_migration[:data][:payment_method] == "stripe"
                customer = CustomerModal.find_by_shopify_id(customer_migration[:customer_id][/\d+/])
                @stripe_customer = Stripe::Customer.list({}, api_key: current_shop.stripe_api_key).data.filter{|c| c.email == customer.email}[0]
                if @stripe_customer.present?
                    AddStripeCustomerMigration.create(raw_data: customer_migration.to_json, customer_id: customer_migration[:customer_id][/\d+/]&.to_i)
                    CustomerService.new({shop: current_shop}).create_customer_payment_remote_method(@stripe_customer&.id, customer_migration[:customer_id])
                else
                  render json:{error: :true, response: "This customer doesn't have stripe account"}.to_json
                end
            else
                customer_migration = customer_migration.deep_stringify_keys
                contract = SubscriptionContractDraftService.new(customer_migration).fetch_customer
            end
        end
    end
end