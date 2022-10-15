class FillPreOrderWorker
  include Sidekiq::Worker

  def perform(contract_id, shopify_order_id, week_number, expected_order_delivery)
    puts "<============== SideKiq Job for contract_id: #{contract_id} running now... ==============>"
    contract = CustomerSubscriptionContract.find_by_id contract_id
    contract ||= CustomerSubscriptionContract.find_by(shopify_id: contract_id)

    shop = contract.shop
    shop.connect
    meals_on_plan = contract.subscription.split[0].to_i

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
     # update preorder
     pre_order.update(order_id: shopify_order_id, expected_delivery_date: expected_order_delivery)
     # Send email notification to user after filling order
     PreOrderEmailNotificationWorker.perform_in(600.seconds, contract_id, week_number)
  rescue => e
    params = {contract_id: contract_id}
    message = "#{e.message} from #{e.backtrace.first}"
    SiteLog.create(log_type: SiteLog::TYPES[:sidekiq_job_failure], message: message, params: params)
    raise e
  end
end
