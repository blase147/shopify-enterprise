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
end
