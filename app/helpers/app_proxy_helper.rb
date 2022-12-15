module AppProxyHelper
  def proxy_path controller, options={}
    "/a/chargezen/#{controller}?customer=#{params[:customer]}&#{options}"
  end

  def icon_tag icon
    image_tag "icons/#{icon}.svg"
  end

  def upgrade_operation_title(last_interval, new_interval)
    return 'DOWNGRADE' if new_interval == 'week'

    case new_interval
    when 'month'
      last_interval == 'week' ? 'UPGRADE' : (last_interval == 'year' ? 'DOWNGRADE' : 'UPGRADE')
    when 'year'
      last_interval == 'month' || last_interval == 'week' ? 'UPGRADE' : 'DOWNGRADE'
    else
      'UPGRADE'
    end
  end

  def get_next_billing_date(subscription, shop, line_id = nil)
    selling_plan_id = get_selling_plan_id(subscription)
    return subscription.next_billing_date.to_date unless selling_plan_id.present?

    selling_plan = SellingPlan.joins(:selling_plan_group).where(selling_plan_groups: { shop_id: shop.id }).find_by(shopify_id: selling_plan_id)
    if selling_plan.present? && selling_plan.billing_dates.present?
      next_date = selling_plan.billing_dates.select{ |plan| plan.to_date > Date.today }.sort.first
      next_date.present? ? next_date.to_date : subscription.next_billing_date.to_date
    else
      subscription.next_billing_date.to_date
    end
  end

  def get_next_shipping_date(subscription, shop)
    selling_plan_id = get_selling_plan_id(subscription)
    return subscription.next_billing_date.to_date rescue nil

    # selling_plan = SellingPlan.joins(:selling_plan_group).where(selling_plan_groups: { shop_id: shop.id }).find_by(shopify_id: selling_plan_id)
    # if selling_plan.present? && selling_plan.shipping_dates.present?
    #   next_date = selling_plan.shipping_dates.select{ |plan| plan.to_date > Date.today }.sort.first
    #   next_date.present? ? next_date.to_date : subscription.next_billing_date.to_date
    # else
    #   subscription.next_billing_date.to_date
    # end
  end

  def get_all_shipping_dates(subscription, shop)
    selling_plan_id = get_selling_plan_id(subscription)
    return nil unless selling_plan_id.present?

    selling_plan = SellingPlan.joins(:selling_plan_group).where(selling_plan_groups: { shop_id: shop.id }).find_by(shopify_id: selling_plan_id)
    if selling_plan.present? && selling_plan.shipping_dates.present?
      selling_plan.shipping_dates.select{ |plan| plan.to_date  > Date.today }.sort rescue []
    end
  end

  def get_selling_plan_id(subscription)
    selling_plan_ids = subscription.lines.edges.map{|edge| edge.node.selling_plan_id}
    selling_plan_ids.reject{ |val| val.nil? }&.first
  end

  def box_campaign_display(box_campaign, selling_plan_id)
    display = false
    if selling_plan_id.present? && box_campaign.selling_plans.present?
      display = box_campaign.selling_plans.any? { |plan| plan['sellingPlanId'] == selling_plan_id }
      return false unless display
    end
    if box_campaign.start_date.present? && box_campaign.end_date.present? && display
      display = (box_campaign.start_date..box_campaign.end_date).cover?(Date.today)
    end
    display
  end

  def meals_on_plan(subscription_name)
    subscription_name&.split[0]&.to_i rescue nil
  end

  def options_for_delivery_day
    delivery_options = DeliveryOption.find_by(shop_id: @current_shop.id)&.api_response
    options = delivery_options[:settings].map {|setting| setting["delivery"].humanize } rescue nil
    options.uniq rescue []
  end

  def hide_display_selection
    @api_data['orders']['edges'].count > 1 ? '' : 'hideJKKJ' rescue nil
  end

  def plan_title
    plan_str = paused_or_cancel_plan? ? @customer&.status.humanize : 'Current'
    "Your #{plan_str} Plan: #{@customer&.subscription}"
  end

  def resume_btn
    if paused_or_cancel_plan?
      button_tag "Resume", class: 'upgrade-subscription light', data: { path: '/resume' }, id: 'pause-resume-sub'
    end
  end

  def billing_attempt_status error_code
    error_code.present? ? "Failure" : "Success"
  end

  def paused_or_cancel_plan?
    @customer&.cancelled? || @customer&.paused?
  end

  def current_week_meals(week_day)
    week_day =  "#{week_day}"&.strip&.to_date&.cweek
    current_week_meals = []
    current_week_meals = WeeklyMenu.where(week: week_day).first&.collection_images&.first["products"] if WeeklyMenu.where(week: week_day).first&.collection_images&.first.present?
    current_week_meals = WeeklyMenu.where(week: week_day).first&.product_images if current_week_meals.blank?
    
     #master weekly menu
     current_week_meals = WeeklyMenu.where(week: -1).first&.product_images if current_week_meals.blank?
     
    return current_week_meals
  end

  def expected_delivery_date(contract_id,order_id)
    return WorldfarePreOrder.where(shopify_contract_id: contract_id,order_id: order_id)&.first&.expected_delivery_date&.strftime("%a, %B %e") rescue nil
  end

  def get_auth_token(email)
    $redis = Redis.new
    @auth = $redis.get("#{email}_auth")
    return @auth
  end

  def admin_auth_token
    $redis = Redis.new
    @auth = $redis.get("admin_auth_token")
    return @auth&.strip
  end

  def all_contracts customer_id
    return CustomerSubscriptionContract.where(shopify_customer_id: customer_id)
  end
  
  def get_customer_modal shopify_id
    return CustomerModal.find_by_shopify_id(shopify_id) rescue nil
  end

  def current_time_pst
    return Time.current.in_time_zone(current_shop.setting.timezone)
  end
end
