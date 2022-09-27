class CheckNextBillingDateWorker
    include Sidekiq::Worker  
    def perform
        begin
            contracts = CustomerSubscriptionContract.all
            contracts&.each do |contract|
                billing_attempts = contract&.billing_attempts["edges"] rescue []
                if billing_attempts.present?
                    billing_date = contract&.api_data["next_billing_date"]&.to_date
                    billing_attempt = billing_attempts&.select {|p| p["node"]["created_at"]&.to_date&.strftime("%d-%m-%Y")==billing_date&.strftime("%d-%m-%Y")}
                    if billing_attempt.present?
                        success = billing_attempt&.select { |p| p["node"]["error_code"] == nil }

                        next_billing_date = success.present? ? billing_date + 7.days :  billing_date + 1.day

                        params={}
                        params[:id]=contract&.shopify_id
                        params[:next_billing_date] = next_billing_date&.to_s
                        id = "gid://shopify/SubscriptionContract/#{params[:id]}"
                        contract&.shop&.connect
                        result = SubscriptionContractUpdateService.new(id).run params
                        ShopifyContractUpdateWorker.perform_async(contract&.shop_id,contract&.shopify_id)
                    end
                end
            end
        rescue=>error
            p error
        end
    end
end

