class SmsService::ProductService < SmsService::ProcessService
  def initialize(conversation, params, subscriptions_data, customer)
    super()
    @conversation = conversation
    @params = params
    @shared_service = SmsService::SharedService.new(conversation, params)
    @data = subscriptions_data
    @customer = customer
    @shop = customer.shop
  end

  def process_message(step)
    error = false
    error_message = 'Invalid Command, Please try again.'
    products = ProductService.new.list
    products_list = products.is_a?(Hash) ? nil : products.select { |p| p.node.selling_plan_group_count.zero? }
    increase_step = step
    case step
    when 1
      message = "Please reply with product ID\n" + @shared_service.get_all_products(products)
    when 2
      product = ShopifyAPI::Product.find(@params['Body']) rescue nil
      if product.present?
        message = "Please select the product variant ID:\n" + product.variants.each_with_index.map{|variant, i| "#{i+1}. #{variant.id} #{variant.title} $#{variant.price}"}.join("\n")
      else
        error = true
      end
    when 3
      variant = ShopifyAPI::Variant.find(@params['Body']) rescue nil
      if variant.present?
        message = 'How many would you like to add'
      else
        error = true
      end
    when 4
      variant_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 3).last
      variant = ShopifyAPI::Variant.find(variant_message.content) rescue nil
      if @params['Body'].to_i.positive? && @params['Body'].to_i < 10000 && variant.present?
        message = "Here would be the content of your order #{variant.title} The total price of the order would be of #{variant.price.to_f * @params['Body'].to_i}$. Do you confirm your operation ?"
      else
        error = true
      end
    when 5
      if @params['Body'].downcase == 'yes'
        variant_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 3).last
        variant = ShopifyAPI::Variant.find(variant_message.content) rescue nil
        quantity_message = @conversation.sms_messages.where(comes_from_customer: true, command_step: 4).last
        input = { customerId: @customer.shopify_identity, useCustomerDefaultAddress: true, lineItems: { quantity: quantity_message.content.to_i, variantId: "gid://shopify/ProductVariant/#{variant.id}", originalUnitPrice: variant.price } }
        result = OrderDraftService.new.create(input)
        if result.is_a?(Hash)
          error = true
        else
          result = OrderDraftService.new.complete(result.id)
          if result.is_a?(Hash)
            error = true
          else
            # @shop.sms_logs.one_time_order.create(product_id: variant.product_id, revenue: variant.price * quantity_message.content.to_i, customer_id: @customer.id)
            @shop.subscription_logs.one_time_order.sms.create(product_id: variant.product_id, revenue: variant.price * quantity_message.content.to_i, customer_id: @customer.id)
            message = 'Product added successfully.'
          end
        end
      else
        message = @shared_service.get_all_products(products_list)
        increase_step = 1
      end
    else
      error = true
    end
    { error: error, message: error ? error_message : message, increase_step: increase_step }
  rescue Exception => ex
    { error: true, message: error_message }
  end
end
