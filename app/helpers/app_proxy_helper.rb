module AppProxyHelper
  def proxy_path controller, options={}
    "/a/chargezen_production/#{controller}?customer_id=#{params[:customer_id]}&#{options}"
  end

  def icon_tag icon
    image_tag "icons/#{icon}.svg"
  end
end