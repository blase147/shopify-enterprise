class FixSkipDatesWorker
    include Sidekiq::Worker
    def perform
        contracts = CustomerSubscriptionContract&.all
        contracts&.each do |contract|
            skip_dates = []
            skip_dates = contract&.skip_dates&.map{ |d| d&.to_date&.cweek&.to_i rescue d&.to_s}
            contract.update(skip_dates: skip_dates)
            skip_dates&.each do |skip_date|
                pre_order = WorldfarePreOrder.where(shopify_contract_id: contract&.shopify_id, week: skip_date&.to_i, customer_id: contract&.shopify_customer_id)
                pre_order&.update(skip_state: "skipped")
            end
        end
    end
end