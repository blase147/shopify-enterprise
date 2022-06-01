class CalculateOrderDelivery

	def initialize(api_data, shop_id)
    @api_data = api_data
    @shop_id = shop_id
  end

  def calculate
  	current_date = Date.current
  	next_billing_date = Date.parse(@api_data["next_billing_date"])
    if next_billing_date < current_date
      current_week_select_by = "There seems to be an issue with your subscription. Please contact support at hello@ethey.com"
      current_week_expected_delivery = nil
    else
      prev_order_date = @api_data["orders"]["edges"].last["node"]["created_at"].to_date rescue nil
      delivery_settings = delivery_setting
      delivery_day = @api_data['delivery_day'].downcase.to_sym rescue nil
      cutoff_day = delivery_settings[:settings].filter{|s| s["delivery"].to_sym  == delivery_day } .first["cutoff_day"].to_sym rescue nil
      first_select_by = next_billing_date.strftime('%A').downcase.to_sym == cutoff_day ? next_billing_date : next_billing_date.next_occurring(cutoff_day) rescue nil
      first_expected_delivery = first_select_by.next_occurring(delivery_day) rescue nil
      current_week_select_by = nil
      current_week_expected_delivery = nil
      next_week_select_by = nil
      next_week_expected_delivery = nil
      previous_orders = @api_data["orders"]["edges"]
      previous_orders.reverse.each do |o|
        time = Time.parse o["node"]["created_at"]
        time = time.in_time_zone('Eastern Time (US & Canada)')
        prev_order_date = time.to_date rescue nil
        prev_order_select_by = prev_order_date.strftime('%A').downcase.to_sym == cutoff_day ? prev_order_date : prev_order_date.next_occurring(cutoff_day) rescue nil
        prev_order_expected_delivery = prev_order_select_by.next_occurring(delivery_day) rescue nil
        if prev_order_expected_delivery.between?(current_date.beginning_of_week, current_date.end_of_week)
          current_week_select_by = prev_order_select_by
          current_week_expected_delivery = prev_order_expected_delivery
        elsif prev_order_expected_delivery.between?((current_date + 1.week).beginning_of_week, (current_date + 1.week).end_of_week)
          next_week_select_by = prev_order_select_by
          next_week_expected_delivery = prev_order_expected_delivery
        end
      end
      if first_expected_delivery.between?(current_date.beginning_of_week, current_date.end_of_week)
        current_week_select_by = first_select_by
        current_week_expected_delivery = first_expected_delivery
      elsif first_expected_delivery.between?((current_date + 1.week).beginning_of_week(:monday), (current_date + 1.week).end_of_week())
        next_week_select_by = first_select_by
        next_week_expected_delivery = first_expected_delivery
      end
    end

    {
    	current_week_select_by: current_week_select_by, 
    	current_week_expected_delivery: current_week_expected_delivery,
    	next_week_select_by: next_week_select_by,
    	next_week_expected_delivery: next_week_expected_delivery
    }
  end

  def expected_delivery_of_order(order_created_at)
  	delivery_settings = delivery_setting
    delivery_day = @api_data['delivery_day'].downcase.to_sym rescue nil
    cutoff_day = delivery_settings[:settings].filter{|s| s["delivery"].to_sym  == delivery_day } .first["cutoff_day"].to_sym rescue nil

  	order_date = Time.parse order_created_at
    order_date = order_date.in_time_zone('Eastern Time (US & Canada)')
    order_select_by = order_date.strftime('%A').downcase.to_sym == cutoff_day ? order_date : order_date.next_occurring(cutoff_day) rescue nil
    order_expected_delivery = order_select_by.next_occurring(delivery_day) rescue nil
    order_expected_delivery
  end

  def delivery_setting
  	DeliveryOption.find_by(shop_id: @shop_id )&.api_response
  end
end
	