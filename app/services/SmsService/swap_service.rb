class SmsService::SwapService < SmsService::ProcessService
  def initialize(conversation, params, subscriptions_data)
    super()
    @conversation = conversation
    @params = params
    @data = subscriptions_data
    @shared_service = SmsService::SharedService.new(conversation, params)
    @customer = conversation.customer
    @shop = @customer.shop
  end

  def process_message(step)
    increase_step = step
    error = false
    error_message = 'Invalid Command, Please try again.'
    products = ProductService.new.list
    active_subscription_products = @data[:active_subscriptions].map { |subscription| subscription.node.lines.edges.map{ |edge| edge.node.product_id } }.flatten
    products_list = products.select{ |product| active_subscription_products.include?(product.node.id) ? nil : product }
    case step
    when 1
      if @data[:active_subscriptions].count > 1
        message = @shared_service.get_all_subscriptions(@data)
      else
        if products_list.is_a?(Hash) && products_list.present?
          error = true
        else
          swap_products = products_list.select{ |p| p.node.selling_plan_group_count > 0 }
          if swap_products.present?
            message = "Please select product ID you want to swap with:\n#{swap_products.each_with_index.map{ |product, i| "#{i+1}. #{product.node.id[/\d+/]} #{product.node.title}" }.join("\n")}"
            increase_step = step + 1
            @shared_service.create_sms_message(@data[:active_subscriptions].first.node.id[/\d+/], 2, comes_from_customer: true)
          else
            error_message = 'No products available for swap.'
          end
        end
      end
    when 2
      subscription = SubscriptionContractService.new(@params['Body']).run
      if subscription.is_a?(Hash)
        error = true
      elsif products_list.is_a?(Hash)
        error = true
      else
        swap_products = products_list.select{ |p| p.node.selling_plan_group_count > 0 }
        message = swap_products.each_with_index.map{ |product, i| "#{i + 1}. #{product.node.id[/\d+/]} #{product.node.title}" }.join("\n")
      end
    when 3
      product = ShopifyAPI::Product.find(@params['Body']) rescue nil
      if product.present?
        message = "Please select the product variant ID:\n#{product.variants.each_with_index.map{|variant, i| "#{i + 1}. #{variant.id} #{variant.title} $#{variant.price}"}.join("\n")}"
      else
        error = true
      end
    when 4
      variant = ShopifyAPI::Variant.find(@params['Body']) rescue nil
      if variant.present?
        subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
        if subscription_message.present?
          subscription = SubscriptionContractService.new(subscription_message.content[/\d+/]).run
          if subscription.is_a?(Hash)
            error = true
          else
            if subscription.lines.edges.count > 1
              message = "Please select the item you want to swap:\n#{subscription.lines.edges.each_with_index.map{ |line, i| "#{i + 1}. #{line.node.id.split("gid://shopify/SubscriptionLine/")[1]} #{line.node.title}"}.join("\n")}"
            else
              message = "You will switch to the #{variant.title} subscription at $#{variant.price} per month, Do you confirm?"
              increase_step = step + 1
              @shared_service.create_sms_message(subscription.lines.edges.first&.node&.id&.split('gid://shopify/SubscriptionLine/')[1], 5, comes_from_customer: true)
            end
          end
        else
          error = true
        end
      else
        error = true
      end
    when 5
      variant_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 4).last
      variant = ShopifyAPI::Variant.find(variant_message.content) rescue nil
      if variant.present?
        message = "You will switch to the #{variant.title} subscription at $#{variant.price} per month, Do you confirm?"
        @shared_service.create_sms_message(@params['Body'], 5, comes_from_customer: true)
      else
        error = true
      end
    when 6
      if @params['Body'].downcase == 'yes'
        subscription_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 2).last
        line_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 5).last
        if subscription_message.present?
          subscription = SubscriptionContractService.new(subscription_message.content[/\d+/]).run
          if subscription.is_a?(Hash)
            error = true
          else
            variant_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 4).last
            variant = ShopifyAPI::Variant.find(variant_message.content) rescue nil
            if variant.present?
              from_variant_id = subscription.lines.edges.select { |edge| edge.node.id == "gid://shopify/SubscriptionLine/#{line_message.content}" }
              draft_id = @shared_service.subscription_draft(subscription.id)
              result = SubscriptionDraftsService.new.line_update draft_id, "gid://shopify/SubscriptionLine/#{line_message.content}", { 'productVariantId': "gid://shopify/ProductVariant/#{variant.id}", 'quantity': 1, 'currentPrice': variant.price }
              SubscriptionDraftsService.new.commit draft_id
              if result[:error].present?
                error = true
              else
                product_id = from_variant_id.first.node.product_id[/\d+/]
                # @shop.sms_logs.swap.create(product_id: product_id, swaped_product_id: variant.product_id, customer_id: @customer.id)
                @shop.subscription_logs.swap.sms.create(subscription_id: subscription_message.content, product_id: product_id, swaped_product_id: variant.product_id, customer_id: @customer.id)
                # @shop.subscription_logs.swap.create(subscription_id: subscription_message.content, customer_id: @customer.id)
                message = 'Subscription swaped succesfully.'
              end
            else
              error = true
            end
          end
        else
          error = true
        end
      else
        message = @shared_service.get_all_subscriptions(@data)
        increase_step = 1
      end
    else
      error = true
    end
    { error: error, message: error ? error_message : message, increase_step: increase_step }
  rescue Exception => ex
    { error: true, message: 'Invalid Command, Please try again.' }
  end
end
