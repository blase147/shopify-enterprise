class DeliveryOption < ApplicationRecord


  def api_response
    {
      id: id,
      delivery_option: delivery_option,
      settings: settings.nil? ? [] : setup_settings(settings)
    }
  end

  def setup_settings(settings)
    sets = []
    JSON.parse(settings).each do |set|
      if Date.today.strftime('%Y%m%d') < Date.today.at_beginning_of_week(set['cutoff_day'].to_sym).strftime('%Y%m%d')
        set['date'] = Date.today.at_beginning_of_week(set['delivery'].to_sym).strftime( '%A %d %b %Y' )
      else
        set['date'] = Date.today.next_week(set['delivery'].to_sym).strftime( '%A %d %b %Y' )
      end
      sets << set
    end
    sets
  end
end
