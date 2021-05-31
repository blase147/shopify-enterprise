# frozen_string_literal: true
class Integration < ApplicationRecord
  belongs_to :shop
  enum status: %i[active pending]
  enum integration_type: %i[sales marketing reporting_and_analytics collaboration accounting customer_support_and_success contract_management tax_management]
  enum service_type: %i[undefined email]

  before_update :set_default_integration

  def set_default_integration
    unless shop.integrations.where(integration_type: integration_type, service_type: service_type, credentials: nil).present?
      self.default = true
    end
  end
end
