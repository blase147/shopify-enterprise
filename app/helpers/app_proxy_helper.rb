module AppProxyHelper
  def proxy_path controller, options={}
    "/a/chargezen_production/#{controller}?customer_id=#{params[:customer_id]}&#{options}"
  end
end