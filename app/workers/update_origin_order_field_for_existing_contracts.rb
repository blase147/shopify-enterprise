class UpdateOriginOrderFieldForExistingContracts
    include Sidekiq::Worker
    def perform
        contracts = CustomerSubscriptionContract.all
        exclude = ["8 meals - medium", "6 meals - small", "4 meals - trial", "12 meals - large", "20 meals - family"]
        contracts&.each do |contract|
            orders = []
            if contract.api_data["origin_order"]["line_items"].present?
                origin_orders = contract.api_data["origin_order"]["line_items"]["edges"]
                origin_orders&.each  do |origin_order|
                    excluded = exclude.include? origin_order["node"]["product"]["title"]&.downcase rescue false
                    unless excluded
                        orders << origin_order
                    end
                end
                contract.origin_order_meals = orders
                contract.save
            end
        end
    end
end
