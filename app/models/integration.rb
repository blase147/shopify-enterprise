# frozen_string_literal: true
class Integration < ApplicationRecord
  belongs_to :shop
  enum status: %i[active pending]
  enum integration_type: %i[sales marketing reporting_and_analytics collaboration accounting customer_support_and_success contract_management tax_management]
  enum service_type: %i[undefined email]

  before_update :set_default_integration
  before_update :set_twilio_shop_phone, if: -> { name == 'Twilio' }

  def set_default_integration
    unless shop.integrations.where(integration_type: integration_type, service_type: service_type).where.not(id: id, credentials: nil).present?
      self.default = true
      unless shop.setting.email_service.present?
        shop.setting.update(email_service: name)
      end
    end
  end

  def set_twilio_shop_phone
    shop.update(phone: credentials['twilio_phone_number'])
  end
end
