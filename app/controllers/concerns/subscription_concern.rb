module SubscriptionConcern
  extend ActiveSupport::Concern

  included do
    before_action :set_draft_contract, only: [:add_product, :update_quantity, :update_shiping_detail, :upgrade_product]
    before_action :set_customer, only: %i[add_product swap_product upgrade_product]
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
      subscription = SubscriptionContractService.new(params[:id]).run
      product = subscription.lines.edges.select{ |line| line.node.id == line_item_id }.first.node
      customer = CustomerSubscriptionContract.find_by(shopify_id: params[:id])
      note = "Subscription - " + subscription.billing_policy.interval_count.to_s + " " + subscription.billing_policy.interval
      description = customer.name+",updated quantity to #{params[:quantity].to_i},"+product.title
      customer.shop.subscription_logs.quantity.create(subscription_id: params[:id], customer_id: customer.id, product_id: line_item_id, product_name: product.title, note: note, description: description)
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
    if @customer.nil? && @customer = CustomerSubscriptionContract.find_by(id: params[:subscription_id])
      variant = ShopifyAPI::Variant.find(params[:variant_id][/\d+/])
      product = ProductService.new(variant.product_id).run
      calc_price = (((variant.price.to_f rescue 0) + (@customer.import_data['shipping_price'].to_f rescue 0)).round(2) * 100).to_i
      unless calc_price == @customer.api_data['items']['data'][0]['price']['unit_amount']
        price = Stripe::Price.create({
          unit_amount: calc_price,
          currency: 'usd',
          product: @customer.api_data['items']['data'][0]['price']['product']
        }, { api_key: shop.stripe_api_key })
        subscription = Stripe::Subscription.update(
          @customer.api_resource_id,
          {
            proration_behavior: 'none',
            items: [
              {
                id: @customer.api_data['items']['data'][0]['id'],
                price: price.id
              }
            ]
          },
          { api_key: current_shop.stripe_api_key }
        )
        @customer.api_data = subscription.to_h
      end
      @customer.import_data['product_id'] = variant.product_id
      @customer.import_data['variant_id'] = variant.id
      @customer.save
    else
      set_draft_contract
      variant_id = params["variant_id#{params[:index]}_#{params[:productindex]}"]
      selling_plan_id = params["selling_plan_id#{params[:index]}_#{params[:productindex]}"]
      selling_plan = SellingPlan.find(selling_plan_id)
      variant = ShopifyAPI::Variant.find(variant_id&.split("/")&.last)
      product = ProductService.new(variant.product_id).run
      result = SubscriptionDraftsService.new.line_update @draft_id, params[:line_id], { 'productVariantId': variant_id, 'quantity': 1, 'currentPrice': variant.price, 'sellingPlanId': selling_plan&.shopify_id, 'sellingPlanName': selling_plan&.name }
      temp = SubscriptionDraftsService.new.commit @draft_id
      if result[:error].present?
        flash[:error] = result[:error]
        render js: "alert('#{result[:error]}'); hideLoading()"
      else
        # current_shop.subscription_logs.swap.create(subscription_id: params[:id], customer_id: @customer.id)
        subscription = SubscriptionContractService.new(params[:id]).run
        note = "Subscription - " + subscription.billing_policy.interval_count.to_s + " " + subscription.billing_policy.interval
        description = @customer.name+",swaped,"+variant.title
        # amount = (product.quantity * variant.price.to_f).round(2).to_s
        current_shop.subscription_logs.swap.create(subscription_id: params[:id], customer_id: @customer.id, product_name: variant.title, note: note, description: description, product_id: variant_id&.split("/")&.last, swaped_product_id: variant.product_id, action_by: params[:action_by])
        SendEmailService.new.send_swap_subscription(@customer, variant.title)
        # redirect_to "/a/chargezen?customer_id=#{@customer.shopify_customer_id}"        
        render js: 'window.location.reload(false)'
      end
    end
  end
  def upgrade_product
    line_update = SubscriptionDraftsService.new.line_update @draft_id, params[:line_id], { 'sellingPlanId': params[:selling_plan_id], 'sellingPlanName': params[:name] }
    if line_update[:error].present?
      flash[:error] = line_update[:error]
      render js: "alert('#{line_update[:error]}'); hideLoading()"
    else
      subscription_update = SubscriptionDraftsService.new.update @draft_id, { billingPolicy: { interval: params[:interval_type], intervalCount: params[:interval_count].to_i }, deliveryPolicy: { interval: params[:interval_type], intervalCount: params[:interval_count].to_i } }
      if subscription_update[:error].present?
        flash[:error] = subscription_update[:error]
        render js: "alert('#{subscription_update[:error]}'); hideLoading()"
      else
        SubscriptionDraftsService.new.commit @draft_id
        subscription = SubscriptionContractService.new(params[:id]).run
        note = "Subscription - " + subscription.billing_policy.interval_count.to_s + " " + subscription.billing_policy.interval
        description = @customer.name+",#{params[:action_text].downcase}d,their plan to #{params[:interval_count]} #{params[:interval_type].titleize}"
        current_shop.subscription_logs.create(action_type: params[:action_text].downcase.to_sym, subscription_id: params[:id], customer_id: @customer.id, note: note, description: description)
        render js: 'location.reload()'
      end
    end
  end

  def remove_line
    if params[:stripe_subscription]
      csc = CustomerSubscriptionContract.find(params[:id])
      Stripe::SubscriptionCancel.new(csc.api_resource_id, current_shop).delete
      csc.update(status: 'CANCELLED', reasons_cancel_id: params[:reasons_cancel_id]) if !csc.nil? && params[:reasons_cancel_id].present?
      begin
        email_notification = csc.shop.setting.email_notifications.find_by_name "Subscription Cancellation"
        EmailService::Send.new(email_notification).send_email({customer: csc, line_name: params[:line_name]}) unless email_notification.nil?
        owner_email_notification = csc.shop.setting.email_notifications.find_by_name "Cancellation Alert"
        EmailService::Send.new(owner_email_notification).send_email({customer: csc, line_name: params[:line_name]}) unless owner_email_notification.nil?
      rescue => e
        puts "Could not send email. #{e.message}"
      end
    else
      set_draft_contract
      if params[:lines_count].to_i > 1
        result = SubscriptionDraftsService.new.remove(@draft_id, params[:line_id])
        RemovedSubscriptionLine.create(subscription_id: params[:id], customer_id: params[:customer], variant_id: params[:variant_id], quantity: params[:quantity] )
      else
        result = SubscriptionContractDeleteService.new(params[:id],nil,true,params[:action_by]).run
      end
      if result[:error].present?
        render js: "alert('#{result[:error]}'); hideLoading()"
      else
        customer = CustomerSubscriptionContract.find_by_shopify_id params[:customer]
        customer.update(reasons_cancel_id: params[:reasons_cancel_id]) if !customer.nil? && params[:reasons_cancel_id].present?
        begin
          email_notification = customer.shop.setting.email_notifications.find_by_name "Subscription Cancellation"
          EmailService::Send.new(email_notification).send_email({customer: customer, line_name: params[:line_name]}) unless email_notification.nil?
          owner_email_notification = customer.shop.setting.email_notifications.find_by_name "Cancellation Alert"
          EmailService::Send.new(owner_email_notification).send_email({customer: customer, line_name: params[:line_name]}) unless owner_email_notification.nil?
        rescue => e
          puts "Could not send email. #{e.message}"
        end
        SubscriptionDraftsService.new.commit @draft_id
        render json: {success: 'true'}
      end
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

  def skip_next_billing_date
    contract = CustomerSubscriptionContract.find_by_id params[:id] rescue nil
    contract ||= CustomerSubscriptionContract.find_by(shopify_id: params[:id])
    
    skip_dates = contract&.skip_dates
    begin_date = params[:skip_date]&.to_date&.beginning_of_week
    end_date = params[:skip_date]&.to_date&.end_of_week
    skip_week_num = params[:skip_date]&.to_date&.cweek.to_s
    pre_order = WorldfarePreOrder.where(shopify_contract_id: contract&.shopify_id, week: skip_week_num&.to_i, customer_id: contract&.shopify_customer_id)
    if params["method"]=="skip"
      skip_dates&.push(skip_week_num)
      pre_order&.update(skip_state: "skipped")
      description = "Skipped weekly meals for #{begin_date} to #{end_date}"
      SendEmailService.new.send_skip_meal(contract, begin_date, end_date)
    else
      skip_dates&.delete(skip_week_num)
      pre_order&.update(skip_state: nil)
      description = "Un-Skipped weekly meals for #{begin_date} to #{end_date}"
      SendEmailService.new.send_unskip_meal(contract, begin_date, end_date)
    end
    contract.shop.subscription_logs.cancel.create(subscription_id: contract&.shopify_id,customer_id: contract.id, description: description, action_by: params[:action_by])
    contract.update(skip_dates: skip_dates)
  end

  def resume
    id = params[:id]
    csc = CustomerSubscriptionContract.find_by(shopify_id: id)
    if params[:stripe_subscription]
      if csc.status == 'CANCELLED'
        row = csc.import_data
        product = Stripe::Product.create({name: "#{row['product_title']}, #{row['variant_title']}"}, { api_key: current_shop.stripe_api_key })
        anchor = ImportStripeSubscriptions.new(nil,nil).next_anchor(row)
        selling_plan = if csc.import_data['variant_title']&.include?('Annual')
          SellingPlan.joins(:selling_plan_group).where(selling_plan_groups: { shop_id: current_shop.id }).find_by(selector_label: 'Annual')
        else
          SellingPlan.joins(:selling_plan_group).where(selling_plan_groups: { shop_id: current_shop.id }).find_by(selector_label: 'Quarterly')
        end
        csc.selling_plan_id = selling_plan.id
        calc_price = if selling_plan.selector_label == 'Annual'
          5499
        elsif selling_plan.selector_label == 'Quarterly'
          5999
        end

        stripe_subscription = Stripe::Subscription.create({
          customer: row['customer_gateway_token'],
          billing_cycle_anchor: anchor,
          proration_behavior: 'none',
          items: [
            {
              price_data: {
                unit_amount_decimal: calc_price,
                currency: 'usd',
                recurring: {
                  interval: selling_plan.interval_type.downcase,
                  interval_count: selling_plan.interval_count
                },
                product: product.id
              }
            }
          ]
        }, { api_key: current_shop.stripe_api_key })
        csc.api_resource_id = stripe_subscription.id
        csc.api_data = stripe_subscription.to_h
      elsif csc.status == 'PAUSED'
        Stripe::SubscriptionPause.new(csc.api_resource_id, current_shop).resume
      end
      csc.status = 'ACTIVE'
      csc.save
      email_notification = csc.shop.setting.email_notifications.find_by_name "Resume Subscription"
      EmailService::Send.new(email_notification).send_email({customer: csc}) unless email_notification.nil?
      render js: 'location.reload()'
    else
      if params[:billing_date]&.to_date < (Date.today + 1.day)
        render json:{error: "Please select a valid date."}
      else
        if csc.status == 'PAUSED'
          result = SubscriptionContractDeleteService.new(id,nil,true,params[:action_by]).run 'RESUMED'
        else
          result = SubscriptionContractDeleteService.new(id,nil,true,params[:action_by]).run 'ACTIVE'
        end      
        if params[:billing_date].present? && result[:error].blank?
          SetNextBillingDate.new(csc.shopify_id, params[:billing_date]).run
        end

        if result[:error].present?
          render js: "alert('#{result[:error]}');"
        else
          ShopifyContractUpdateWorker.perform_async(csc&.shop_id, csc&.shopify_id)
          email_notification = csc.shop.setting.email_notifications.find_by_name "Resume Subscription"
          EmailService::Send.new(email_notification).send_email({customer: csc}) unless email_notification.nil?
          render js: 'location.reload()'
        end
      end
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
    @customer = CustomerSubscriptionContract.find_by(shopify_id: params[:id])
  end
end
