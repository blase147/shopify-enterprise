module SubscriptionConcern
  extend ActiveSupport::Concern

  included do
    before_action :set_draft_contract, only: [:add_product, :update_quantity, :update_shiping_detail, :swap_product, :remove_line]
    before_action :set_customer, only: %i[add_product swap_product]
  end

  def add_product
    variant = ShopifyAPI::Variant.find(params[:variant_id])
    product = ProductService.new(variant.product_id).run
    if product&.selling_plan_group_count&.positive?
      result = SubscriptionDraftsService.new.add_line(@draft_id, { 'productVariantId': "gid://shopify/ProductVariant/#{params[:variant_id]}", 'quantity': params[:quantity].to_i.zero? ? 1 : params[:quantity].to_i, 'currentPrice': variant.price })
      render js: "alert('#{result[:error]}'); hideLoading()" if result[:error].present?
      SubscriptionDraftsService.new.commit @draft_id
      RemovedSubscriptionLine.find(params[:line_item_id]).destroy if params[:line_item_id].present?
      render js: 'location.reload()' if result.present?
    else
      render js: "window.top.location.href = '/cart/#{variant.id}:1';"
    end
    # current_shop.subscription_logs.upsell.create(subscription_id: params[:id], customer_id: @customer.id)
  end

  def update_quantity
    line_item_id = params[:line_item_id]
    result = SubscriptionDraftsService.new.line_update(@draft_id, line_item_id, { quantity: params[:quantity].to_i })
    SubscriptionDraftsService.new.commit @draft_id
    if result[:error].present?
      flash[:error] = result[:error]
      render js: "alert('#{result[:error]}'); hideLoading()"
    else
      render js: 'location.reload()'
    end
  end

  def update_shiping_detail
    input = { deliveryMethod: { shipping: {address: params[:address].permit!.to_h.except(:id) } } }
    result = SubscriptionDraftsService.new.update @draft_id, input
    SubscriptionDraftsService.new.commit @draft_id
    if result[:error].present?
      flash[:error] = result[:error]
      render js: "alert('#{result[:error]}'); hideLoading()"
    else
      render js: 'location.reload()'
    end
  end

  def swap_product
    variant = ShopifyAPI::Variant.find(params[:variant_id][/\d+/])
    product = ProductService.new(variant.product_id).run
    result = SubscriptionDraftsService.new.line_update @draft_id, params[:line_id], { 'productVariantId': params[:variant_id], 'quantity': 1, 'currentPrice': variant.price }
    SubscriptionDraftsService.new.commit @draft_id
    if result[:error].present?
      flash[:error] = result[:error]
      render js: "alert('#{result[:error]}'); hideLoading()"
    else
      # current_shop.subscription_logs.swap.create(subscription_id: params[:id], customer_id: @customer.id)
      subscription = SubscriptionContractService.new(params[:id]).run
      note = "Subscription - " + subscription.billing_policy.interval_count.to_s + " " + subscription.billing_policy.interval
      description = @customer.name+",just swap,"+variant.title
      # amount = (product.quantity * variant.price.to_f).round(2).to_s
      current_shop.subscription_logs.swap.create(subscription_id: params[:id], customer_id: @customer.id, product_name: variant.title, note: note, description: description, product_id: params[:variant_id], swaped_product_id: variant.product_id)
      render js: 'location.reload()'
    end
  end

  def remove_line
    if params[:lines_count].to_i > 1
      result = SubscriptionDraftsService.new.remove(@draft_id, params[:line_id])
      RemovedSubscriptionLine.create(subscription_id: params[:id], customer_id: params[:customer_id], variant_id: params[:variant_id], quantity: params[:quantity] )
    else
      result = SubscriptionContractDeleteService.new(params[:id]).run
    end
    if result[:error].present?
      render js: "alert('#{result[:error]}'); hideLoading()"
    else
      customer = Customer.find_by_shopify_id params[:customer_id]
      customer.update(reasons_cancel_id: params[:reasons_cancel_id]) if !customer.nil? && params[:reasons_cancel_id].present?
      email_notification = customer.shop.setting.email_notifications.find_by_name "Subscription Cancellation"
      EmailService::Send.new(email_notification).send_email({customer: customer, line_name: params[:line_name]}) unless email_notification.nil?
      owner_email_notification = customer.shop.setting.email_notifications.find_by_name "Cancellation Alert"
      EmailService::Send.new(owner_email_notification).send_email({customer: customer, line_name: params[:line_name]}) unless owner_email_notification.nil?
      SubscriptionDraftsService.new.commit @draft_id
      render js: 'location.reload()'
    end
  end

  def skip_schedule
    billing_date = DateTime.parse(params[:billing_date])
    skip_billing_offset = params[:billing_interval_count].to_i.send(params[:billing_interval].downcase)
    result = ScheduleSkipService.new(params[:id]).run({ billing_date: billing_date + skip_billing_offset })
    if result[:error].present?
      render js: "alert('#{result[:error]}'); hideLoading()"
    else
      render js: 'location.reload()'
    end
  end

  def pause
    id = params[:id]
    result = SubscriptionContractDeleteService.new(id).run 'PAUSED'
    if result[:error].present?
      render js: "alert('#{result[:error]}');"
    else
      render js: 'location.reload()'
    end
  end

  def resume
    id = params[:id]
    result = SubscriptionContractDeleteService.new(id).run 'ACTIVE'

    if result[:error].present?
      render js: "alert('#{result[:error]}');"
    else
      render js: 'location.reload()'
    end
  end

  def set_draft_contract
    contract_id = "gid://shopify/SubscriptionContract/#{params[:id]}"
    result = SubscriptionContractUpdateService.new(contract_id).get_draft params
    if result[:error].present?
      flash[:error] = result[:error]
      render js: "alert('#{result[:error]}'); hideLoading()"
    else
      @draft_id = result[:draft_id]
    end
  end

  def set_customer
    @customer = Customer.find_by(shopify_id: params[:id])
  end
end
