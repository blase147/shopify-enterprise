module ApplicationHelper
  def active_tab(controller, action=nil)
    if controller_name == controller && (action.blank? || action_name == action)
      "Polaris-Tabs__Tab--selected"
    end
  end

  def active_nav(controller, action=nil)
    if controller_name == controller && (action.blank? || action_name == action)
      "Polaris-Navigation__Item--selected"
    end
  end

  def page_class
    "page-#{controller_name} #{action_name}"
  end

  def icon_tag icon
    image_tag("icons/#{icon}.svg", class: 'icon')
  end

  def action_subscription_path(action, query = '')
    "/a/chargezen_production/subscriptions/#{params[:id]}/#{action}?customer_id=#{params[:customer_id]} #{query.present? ? "&#{query}" : ''}"
  end

  def app_path path
    "#{path}?hmac=#{session[:hmac]}&shop=#{session[:shop]}"
  end

  def shopify_product_id(product_id)
    "gid://shopify/Product/#{product_id}"
  end

  def action_subscription_contract_path(action, contractId, query = '')
    "/a/chargezen_production/subscriptions/#{contractId}/#{action}?customer_id=#{params[:customer_id]} #{query.present? ? "&#{query}" : ''}"
  end
end
