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
    stop = 1
    future_dates = setup( settings )
    while (stop <= delivery_option) do
      JSON.parse(settings).each_with_index do |set, key|
        if stop <= delivery_option
          set['date'] = future_dates[set['delivery']][week]
          set['date_i'] = DateTime.parse(future_dates[set['delivery']][week]).to_i
          sets << set
        end
        stop += 1
      end
      week += 1
    end
    sets.sort_by! { |k| k["date_i"] }
  end

  private

  def setup( settings )
    sets = {}
    DateTime.now.to_i
    JSON.parse(settings).each do |set|
      sets[set['delivery']] = []

      if DateTime.now.to_i < Date.today.at_beginning_of_week(set['cutoff_day'].to_sym).to_time.to_i
        sets[set['delivery']] << Date.today.at_beginning_of_week(set['delivery'].to_sym).strftime('%A %d %b %Y')
      end

      if Date.today.next_week(set['cutoff_day'].to_sym).to_time.to_i < Date.today.next_week(set['delivery'].to_sym).to_time.to_i
        sets[set['delivery']] << Date.today.next_week(set['delivery'].to_sym).strftime('%A %d %b %Y')
      end
      sets[set['delivery']] << Date.today.next_week.next_week(set['delivery'].to_sym).strftime('%A %d %b %Y')
      sets[set['delivery']] << Date.today.next_week.next_week.next_week(set['delivery'].to_sym).strftime('%A %d %b %Y')
      sets[set['delivery']] << Date.today.next_week.next_week.next_week.next_week(set['delivery'].to_sym).strftime('%A %d %b %Y')
    end
    sets
  end
end
