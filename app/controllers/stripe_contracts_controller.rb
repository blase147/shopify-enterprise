class StripeContractsController < ActionController::Base
  skip_before_action :verify_authenticity_token
  # to search stripe customers
  def fetch_stripe_customers
    init_stripe
    stripe_customers = Stripe::Customer.search({query: "email~ '#{params[:query]}' OR name~ '#{params[:query]}'"})&.data&.pluck("email") rescue []
    render json:{status: :ok, customers: stripe_customers}
  end

  # to save stripe contracts in db
  def create_stripe_contract
    params[:data] = JSON.parse(params[:formData]) rescue nil

    init_stripe
    stripe_customer = Stripe::Customer.list({email: params[:data]["email"]})&.data&.first

    unless stripe_customer.present?
      Stripe::Customer.create({
        email:  params[:data]["email"],
        phone: params[:data]["phone"],
        address: {
          country: params[:data]["country"],
          line1: params[:data]["address1"],
          postal_code: params[:data]["zip_code"],
          state: params[:data]["state"],
          city: params[:data]["city"]
        }
      })
    else
      Stripe::Customer.update(
        stripe_customer&.id ,
        {
          email:  params[:data]["email"],
          phone: params[:data]["phone"],
          address: {
            country: params[:data]["country"],
            line1: params[:data]["address1"],
            postal_code: params[:data]["zip_code"],
            state: params[:data]["state"],
            city: params[:data]["city"]
          }
      })

    end

    customer = CustomerModal.find_by("lower(email) = '#{params[:data]["email"].downcase}'")
    unless customer.present?
      customer = CustomerModal.create(email: params[:data]["email"].downcase, shop_id: current_shop.id )
    end

    #update customer fields
    customer.phone = params[:data]["phone"] if params[:data]["phone"].present?
    customer.city = params[:data]["city"] if params[:data]["city"].present?
    customer.address1 = params[:data]["address1"] if params[:data]["address1"].present?
    customer.country = params[:data]["country"] if params[:data]["country"].present?
    customer.state = params[:data]["state"] if params[:data]["state"].present?
    customer.zip_code = params[:data]["zip_code"] if params[:data]["zip_code"].present?
    customer.bank_detail = params[:data]["bank_detail"] if params[:data]["bank_detail"].present?
    customer.save

    auth_token = SecureRandom.urlsafe_base64(nil, false)
    
    StripeAuthToken.find_or_initialize_by(customer_modal_id: customer.id)&.update(token: auth_token)
    
    stripe_contract = StripeContract.create(shop_id: current_shop&.id,customer_modal_id: customer.id, stripe_product_id: params[:data]["stripe_product"], stripe_product_name: params[:data]["stripe_product_name"] )
    if params[:file].present?
      stipe_contract_pdf = StripeContractPdf.create(shop_id: current_shop&.id, contract_pdf: params[:file])
      stripe_contract.update(stripe_contract_pdf_id: stipe_contract_pdf.id)
    end

    #send email to user
    sent = SendEmailService.new.send_stripe_contract_email(customer, auth_token, current_shop.id)
    #send message to user
    url = "https://#{current_shop&.shopify_domain}/a/chargezen/contract/#{auth_token}"
    sms_app_proxy_link(customer,url, current_shop.id)

    render json:{status: :ok, response: "Successfuly Created"}
  end

  # to get current_shop
  def current_shop
    if params[:shopify_domain].present? && current_user.present?
      shop = current_user.user_shops.joins(:shop).where("shops.shopify_domain = '#{params[:shopify_domain]}.myshopify.com' OR shops.shopify_domain = '#{params[:shopify_domain]}'")&.first&.shop
      @current_shop = shop
    else
      @current_shop ||= Shop.find_by(shopify_domain: current_shopify_session.domain)
    end
  end

  # to get all products from stripe with pagination
  def get_stripe_products
    init_stripe
    has_prev = false
    has_more = false
    limit_per_page = 10
    if params[:next_page].present?
      has_prev = true
      @stripe_products = Stripe::Product.list({limit: limit_per_page, starting_after:  params[:next_page]})
      has_more = @stripe_products&.has_more
    elsif params[:prev_page].present?
      @stripe_products = Stripe::Product.list({limit: limit_per_page, ending_before:  params[:prev_page]})

      #check if has_previous page
      prev_products = Stripe::Product.list({limit: limit_per_page, ending_before:  @stripe_products&.data&.first&.id})&.data rescue []
      if prev_products.present?
        has_prev = true
      end
      has_more = true
    else
      has_prev = false
      @stripe_products = Stripe::Product.list({limit: limit_per_page})
      has_more = @stripe_products&.has_more
    end
    render json:{status: :ok, products:  @stripe_products&.data, has_more: has_more, has_prev: has_prev}
    
  end

  def fetch_all_contract_pdfs
    contract_pfs = StripeContractPdf.where(shop_id: current_shop&.id ) rescue []
    render json:{status: :ok, contract_pfs: contract_pfs}
  end

  private
  #to initialize stripe
  def init_stripe
    Stripe.api_key = current_shop&.stripe_api_key
  end

  def sms_app_proxy_link(customer,url, shop_id)
    shop = Shop.find(shop_id)
    message_service = SmsService::MessageGenerateService.new(shop, customer)
    phone = customer.phone
    message = message_service.content("Stripe Contract",nil,url)
    sent = TwilioServices::SendSms.call(from: shop.phone, to: phone, message: message) rescue nil
  end

end
