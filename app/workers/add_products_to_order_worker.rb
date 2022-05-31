class AddProductsToOrderWorker
  include Sidekiq::Worker

  def perform(shopify_order_id, contract_id)
    if shopify_order_id.present? && contract_id.present?
      puts "<============== SideKiq Job for ShopipfyOrder: #{shopify_order_id}, contract_id: #{contract_id} ==============>"

      contract = CustomerSubscriptionContract.find_by_id contract_id
      contract ||= CustomerSubscriptionContract.find_by(shopify_id: contract_id)
      shop = contract.shop
      shop.connect
      meals_on_plan = contract.subscription.split[0].to_i
      
      order = ShopifyAPI::Order.find(shopify_order_id) rescue nil
      week_number = order.created_at.to_date.cweek rescue nil

      if order.present? && week_number.present?
        pre_order = WorldfarePreOrder.find_by(shopify_contract_id: contract.shopify_id, week: week_number)

        if pre_order.blank?
          pre_order = WorldfarePreOrder.create(shop_id: shop.id, shopify_contract_id: contract.shopify_id, week: week_number, customer_id: contract.shopify_customer_id, products: "[]", created_by: WorldfarePreOrder::CREATION_TYPES[:rake])
        end

        pre_order_products = JSON.parse(pre_order.products)
        pre_order_ids = [pre_order.id]

        if pre_order_products.count < meals_on_plan
          FillPreOrder.new(pre_order_ids, contract.id).fill
        end

        pre_order.reload
        pre_order_products = JSON.parse(pre_order.products)
        
        result = AddOrderLineItem.new(shopify_order_id, pre_order_products).call
        puts result.order_edit_commit.order.id
        puts result.order_edit_commit.user_errors
      else
        puts "Rake task is aborting as order not found"
      end
    else
      puts "shopify_order_id or contract_id not present"
    end
  rescue => e
    params = {shopify_order_id: shopify_order_id, contract_id: contract_id}
    message = "#{e.message} from #{e.backtrace.first}"
    SiteLog.create(log_type: SiteLog::TYPES[:sidekiq_job_failure], message: message, params: params)
  end
end
