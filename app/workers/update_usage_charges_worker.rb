class UpdateUsageChargesWorker
    include Sidekiq::Worker  
    sidekiq_options :retry => 3, :dead => false
    def perform_async
        Shop&.all&.each do |shop|
            shop.connect
            charge_id = shop.recurring_charge_id
            if charge_id.present?
                recurring_charge = ShopifyAPI::RecurringApplicationCharge.find(charge_id)
                recurring_charge&.usage_charges&.each do |usage_charge|
                    db_usage_charge = shop.usage_charges.find_or_initialize_by(shopify_id: usage_charge.id)
                    db_usage_charge.update(
                        description: usage_charge.description,
                        price: "#{usage_charge.price}",
                        created_at: "#{usage_charge.created_at}",
                        billing_on: "#{usage_charge.billing_on}",
                        balance_used: "#{usage_charge.balance_used}",
                        balance_remaining: "#{usage_charge.balance_remaining}",
                        risk_level: "#{usage_charge.risk_level}"
                    )
                end
            end
        end
    end
end