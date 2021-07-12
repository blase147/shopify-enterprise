class AppProxy::SellingPlansController < AppProxyController
  before_action :set_customer

  def index
    head(:ok)
  end

  private

  def set_customer
    @customer = Customer.find_by_shopify_id(customer_id)
  end
end
