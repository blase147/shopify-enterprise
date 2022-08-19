class UpdateOriginOrderFieldForExistingContracts
    include Sidekiq::Worker
    def perform
        contracts = CustomerSubscriptionContract.all
        exclude = ["4 meal box", "6 meal box", "8 meal box", "12 meal box", "20 meal box"]
        contracts&.each do |contract|
            orders = []
            if contract.api_data["origin_order"]["line_items"].present?
                origin_orders = contract.api_data["origin_order"]["line_items"]["edges"]
                origin_orders&.each do |origin_order|
                    unless exclude.include? origin_order["node"]["product"]["title"]&.downcase
                        orders << origin_order
                    end
                end
                contract.origin_order_meals = orders
                contract.save
            end
        end
    end
end