class DeliveryOption < ApplicationRecord


  def api_response
    {
      id: id,
      delivery_option: delivery_option,
      settings: settings.nil? ? [] : JSON.parse(settings)
    }
  end
end
