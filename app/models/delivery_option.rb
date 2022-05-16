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

    week = 0
    stop = 0
    future_dates = setup( settings )
    future_dates = future_dates.values.flatten.map{|d| Date.parse(d)}.sort.map{|d| d.strftime('%A %d %b %Y')}
    parse_settings = JSON.parse(settings)
    while (stop <= delivery_option-1) do
      delivery_date = future_dates[stop]
      set = {}
      parse_settings.each do |s|
        set = s.dup if s['delivery'] == delivery_date.split().first.downcase
      end
      set['date'] = delivery_date
      set['date_i'] = delivery_date.to_time.to_i
      sets << set
      stop += 1
    end
    sets
  end

  private

  def setup( settings )
    sets = {}
    JSON.parse(settings).each do |set|
      sets[set['delivery']] = []

      first_delivery = (Date.today).next_occurring(set['cutoff_day'].to_sym).next_occurring(set['delivery'].to_sym)
      second_delivery = first_delivery.next_occurring(set['delivery'].to_sym)
      third_delivery = second_delivery.next_occurring(set['delivery'].to_sym)
      fourth_delivery = third_delivery.next_occurring(set['delivery'].to_sym)

      sets[set['delivery']] << first_delivery.strftime('%A %d %b %Y')
      sets[set['delivery']] << second_delivery.strftime('%A %d %b %Y')
      sets[set['delivery']] << third_delivery.strftime('%A %d %b %Y')
      sets[set['delivery']] << fourth_delivery.strftime('%A %d %b %Y')
    end
    sets
  end
end
