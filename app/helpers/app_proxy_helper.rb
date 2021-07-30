module AppProxyHelper
  def proxy_path controller, options={}
    "/a/chargezen_production/#{controller}?customer_id=#{params[:customer_id]}&#{options}"
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

  def get_next_billing_date(subscription, shop)
    selling_plan_id = subscription.to_h.dig('lines', 'edges', 0, 'node', 'sellingPlanId')
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
    selling_plan_id = subscription.to_h.dig('lines', 'edges', 0, 'node', 'sellingPlanId')
    return subscription.next_billing_date.to_date unless selling_plan_id.present?

    selling_plan = SellingPlan.joins(:selling_plan_group).where(selling_plan_groups: { shop_id: shop.id }).find_by(shopify_id: selling_plan_id)
    if selling_plan.present? && selling_plan.shipping_dates.present?
      next_date = selling_plan.shipping_dates.select{ |plan| plan.to_date > Date.today }.sort.first
      next_date.present? ? next_date.to_date : subscription.next_billing_date.to_date
    else
      subscription.next_billing_date.to_date
    end
  end

  def box_campaign_display(box_campaign, selling_plan_id)
    display = false
    if box_campaign.start_date.present? && box_campaign.end_date.present?
      display = (box_campaign.start_date..box_campaign.end_date).cover?(Date.today)
    end
    if selling_plan_id.present? && box_campaign.selling_plans.present? && !display
      display = box_campaign.selling_plans.any? { |plan| plan['sellingPlanId'] == selling_plan_id }
    end
    display
  end
end
