class AppProxy::AccountController < AppProxyController
  before_action :set_customer, only: [:shipping, :personal, :password, :update_address]

  def personal; end

  def shipping; end

  def password; end

  def update_info
    result = customer_service.update params
    if result.is_a?(Hash)
      flash[:error] = result[:error]
      render js: "alert('#{result[:error]}'); hideFormLoading()"
    else
      render js: "location.reload();"
    end
  end

  def update_address
    result = customer_service.update_address params
    if result.is_a?(Hash)
      flash[:error] = result[:error]
      render js: "alert('#{result[:error]}'); hideFormLoading()"
    else
      render js: "location.reload();"
    end
  end

  private

  def customer_service
    @customer_service ||= CustomerService.new({shop: current_shop})
  end

  def set_customer
    skip_customer_valid = ENV['DEBUG'].present? && ENV['DEBUG'].to_bool ? true : false
    @customer = customer_service.find(customer_id) unless skip_customer_valid
  end
end
