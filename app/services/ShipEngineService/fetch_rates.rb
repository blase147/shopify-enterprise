class ShipEngineService::FetchRates
  def initialize(shop, order)
    @shop = shop
    @shop.connect
    @order = order
  end

  def fetch
    carriers_result = Faraday.get('https://api.shipengine.com/v1/carriers', nil, 'API-Key' => ENV['SHIP_ENGINE_API_KEY'])
    if carriers_result.status == 200
      carriers = JSON.parse(carriers_result.body)
      if carriers['carriers'].present?
        response = Faraday.post('https://api.shipengine.com/v1/rates', rate_data(carriers['carriers']).to_json, "Content-Type" => "application/json", 'API-Key' => ENV['SHIP_ENGINE_API_KEY'])
        if response.status == 200
          rates = JSON.parse(response.body)
          rates['rate_response']['rates']
        else
          rates = JSON.parse(response.body)
          raise rates[:error] if rates['errors'].present?
        end
      else
        raise 'Carriers not present.'
      end
    else
      carriers = JSON.parse(carriers_result.body)
      raise carriers[:error] if carriers['errors'].present?
    end
  rescue StandardError => e
    puts "ERROR: #{e.message}"
  end

  def rate_data(carriers)
    ship_to = @order.ship_to
    ship_from = @order.ship_from
    carrier_ids = carriers.map { |c| c['carrier_id'] }
    {
      "rate_options": {
        "carrier_ids": carrier_ids
      },
      "shipment": {
        "validate_address": "no_validation",
        "ship_to": {
          "name": ship_to['name'],
          "phone": ship_to['phone'],
          "address_line1": ship_to['address1'],
          "city_locality": ship_to['city'],
          "state_province": ship_to['province_code'],
          "postal_code": ship_to['zip'],
          "country_code": ship_to['country_code'],
          "address_residential_indicator": 'yes'
        },
        "ship_from": {
          "company_name": ship_from['company_name'],
          "name": ship_from['name'],
          "phone": ship_from['phone'],
          "address_line1": ship_from['address1'],
          "city_locality": ship_from['city'],
          "state_province": ship_from['province_code'],
          "postal_code": ship_from['zip'],
          "country_code": ship_from['country_code'],
          "address_residential_indicator": 'no'
        },
        "packages": order_packages
      }
    }
  end

  def order_packages
    packages = []
    @order.order_items.each do |item|
      package = {
        "weight": {
          "value": item['weight'],
          "unit": item['weight_unit']
        }
      }
      packages.push(package)
    end
    packages
  end
end
