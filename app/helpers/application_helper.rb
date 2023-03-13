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
    "/a/chargezen/subscriptions/#{params[:id]}/#{action}?customer=#{params[:customer]} #{query.present? ? "&#{query}" : ''}"
  end

  def app_path current_shop, path
    "/#{current_shop&.shopify_domain&.gsub(".myshopify.com","")}#{path}"
  end

  def shopify_product_id(product_id)
    "gid://shopify/Product/#{product_id}"
  end

  def action_subscription_contract_path(action, contract_id, query = '')
    if params[:controller] == 'subscriptions'
      "/subscriptions/#{contract_id}/#{action}?#{query.present? ? "#{query}" : ''}"
    else
      "/a/chargezen/subscriptions/#{contract_id}/#{action}?customer=#{params[:customer]}#{query.present? ? "&#{query}" : ''}"
    end
  end
end
