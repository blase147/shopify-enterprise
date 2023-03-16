class SelectPlanController < AuthenticatedController
  skip_before_action :verify_authenticity_token
  def index
    current_shop = Shop.find_by_shopify_domain("#{params[:shopify_domain]}.myshopify.com")
    current_shop.connect
    unless current_shop.recurring_charge_id.blank?
      check_shopify_backend "#{params[:shopify_domain]}.myshopify.com"
      redirect_to "/#{params[:shopify_domain]}"
    else
      render :index, layout: 'layouts/subscriptions'
    end
  end

  def create
    current_shop = Shop.find_by_shopify_domain(params[:shop])
    current_shop.connect
    @recurring_application_charge = StoreChargeService.new(current_shop).create_recurring_charge(params[:plan])
    
    check_shopify_backend params[:shop]
  end

  def check_shopify_backend shop
    from_shop = Shop.find_by_shopify_domain(shop) rescue nil
    if from_shop.present?
      from_shop.connect
      from_shop = ShopifyAPI::Shop.current rescue nil
      admin = User.find_by_email(from_shop&.customer_email&.strip)
      shop = Shop.find_by_shopify_domain(from_shop&.myshopify_domain)
      admin.user_shops.find_by_shop_id(shop.id)&.update(sign_out_after: (Time.current + 30.minutes))
      sign_in(admin)
      redirect_to "/#{from_shop&.myshopify_domain&.gsub(".myshopify.com", "")}/"
    end
  end

end
