class AddProductsToOrderWorker
  include Sidekiq::Worker

  sidekiq_retry_in do |count|
    43200
  end

  def perform(shopify_order_id, contract_id)
    if shopify_order_id.present? && contract_id.present?
      puts "<============== SideKiq Job for ShopipfyOrder: #{shopify_order_id}, contract_id: #{contract_id} ==============>"

      contract = CustomerSubscriptionContract.find_by_id contract_id
      contract ||= CustomerSubscriptionContract.find_by(shopify_id: contract_id)
      shop = contract.shop
      shop.connect
      meals_on_plan = contract.subscription.split[0].to_i

      order = ShopifyAPI::Order.find(shopify_order_id) rescue nil

      expected_order_delivery = CalculateOrderDelivery.new(contract, shop.id).expected_delivery_of_order(order.created_at)
      order_select_by = CalculateOrderDelivery.new(contract, shop.id).cuttoff_for_order(order.created_at)
      week_number = expected_order_delivery.to_date.cweek

      if order.present?
        note_attributes = order&.note_attributes

        order.note_attributes << { name: "Expected Delivery Date", value: expected_order_delivery.strftime('%d/%m/%Y') }
        order.save
      end

      cutoff_in_hours = ((order_select_by.to_time.beginning_of_day - Date.today.to_time.beginning_of_day) / 3600).to_i

      if order.present? && week_number.present?
        pre_order = WorldfarePreOrder.find_by(shopify_contract_id: contract.shopify_id, week: week_number)
        

        if pre_order.present? || cutoff_in_hours.negative?
          pre_order_products = JSON.parse(pre_order&.products)
          pre_order_ids = [pre_order.id]

          if pre_order_products.count < meals_on_plan
            FillPreOrder.new(pre_order_ids, contract.id).fill
          end

          pre_order.reload
          pre_order_products = JSON.parse(pre_order.products)

          result = AddOrderLineItem.new(shopify_order_id, pre_order_products).call
          puts result.order_edit_commit.order.id
          puts result.order_edit_commit.user_errors
          
          # update preorder
          pre_order.update(order_id: shopify_order_id, expected_delivery_date: expected_order_delivery)
           # Send email notification to user after filling order
          PreOrderEmailNotificationWorker.perform_in(600.seconds, contract_id, week_number)
          
        else
          # Enque sidekiq job to create Pre-Order on select by
          FillPreOrderWorker.perform_in(cutoff_in_hours.hours-12.hours, contract.id, shopify_order_id, week_number, expected_order_delivery)
        end
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
    raise e
  end
end
