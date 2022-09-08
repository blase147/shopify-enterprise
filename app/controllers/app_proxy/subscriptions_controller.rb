class AppProxy::SubscriptionsController < AppProxyController
  before_action :init_session
  include SubscriptionConcern

  def index
    customer_id = "gid://shopify/Customer/#{params[:customer_id]}"
    @data = CustomerSubscriptionContractsService.new(customer_id).run params[:cursor]
    @subscription_contracts = @data[:subscriptions] || []

    render 'index', content_type: 'application/liquid', layout: 'liquid_app_proxy'
  end

  def show
    @subscription = SubscriptionContractService.new(params[:id]).run

    product_id = @subscription.lines.edges.first.node.product_id[/\d+/]
    @product = ShopifyAPI::Product.find(product_id)

    unless params[:customer_id] == @subscription.customer.id[/\d+/]
      redirect_to "/a/chargezen_production/subscriptions/?customer_id=#{params[:customer_id]}"
    end

    render 'show', content_type: 'application/liquid', layout: 'liquid_app_proxy'
  end

  def cancel
    id = params[:id]
    if params[:cancel_later_date].present?
      contract = CustomerSubscriptionContract.find(id&.to_i) rescue nil
      contract.update(cancel_later: params[:cancel_later_date]&.to_date)
      render js:{ success: :true }.to_json
    else
      result = SubscriptionContractDeleteService.new(id).run
      if result[:error].present?
        render :json => { error: result[:error] }
      else
        render js: "location.reload();"
      end
    end
  end

  def change_bill
    id = params[:id]
    result = CardUpdateService.new(id).run

    if result.is_a?(Hash)
      render json: { error: result[:error] }
    else
      render json: { status: :ok, message: 'Success', show_notification: true }
    end
  end

  def update_subscription
    if params[:subscription].present? && params[:subscription][:next_billing_date].present?
      date = begin
               params[:subscription][:next_billing_date].to_date
             rescue StandardError
               nil
             end
      begin
        if date.nil?
          splitted_date = params[:subscription][:next_billing_date].split('/')
          params[:subscription][:next_billing_date] = [splitted_date[2], splitted_date[0], splitted_date[1]].join('-')
        end
      rescue
        p 'Error: '
      end
    end
    id = "gid://shopify/SubscriptionContract/#{params[:id]}"
    result = SubscriptionContractUpdateService.new(id).run params

    if result.is_a?(Hash)
      flash[:error] = result[:error]
      render js: "alert('#{result[:error]}'); hideLoading()"
    else
      if params[:quantity].present? && params[:customer_id].present?
        customer = ShopifyAPI::Customer.find( params[:customer_id] )
        if customer.present?
          tags = ["#{params[:quantity]}box"]
          customer.tags.split(',').each do |tag|
            if !['8box', '10box', '12box'].include?( tag.strip.downcase )
              tags << tag
            end
          end
          customer.tags = tags.join(',')
          customer.save
        end
      end
      render js: 'location.reload();'
    end
  end

  def apply_discount
    redeem_code = params[:redeem_code]
    result = SubscriptionDraftsService.new.apply_discount(@draft_id, redeem_code)
    SubscriptionDraftsService.new.commit @draft_id
    if result[:error].present?
      flash[:error] = result[:error]
      render js: "alert('#{result[:error]}'); hideLoading()"
    else
      render js: 'location.reload()'
    end
  end

  def update_payment
    contract = CustomerSubscriptionContract.find_by(shopify_customer_id: params[:customer_id], api_source: 'stripe')

    if contract
      response = Stripe::Customer.create_source(
        'cus_Jcr1Cdk887KAqN',
        {
          source: {
            object: 'card',
            number: params[:card_number],
            exp_month: params[:exp_month],
            exp_year: params[:exp_year],
            cvc: params[:verification_value]
          }
        },
        { api_key: current_shop.stripe_api_key }
      )
    end

    session = Faraday.post('https://elb.deposit.shopifycs.com/sessions', { credit_card: { number: params[:card_number], first_name: params[:name], month: params[:exp_month], year: params[:exp_year], verification_value: params[:verification_value] } }.to_json, 'Content-Type' => 'application/json')
    if session.status == 200
      session_id = JSON.parse(session.body)['id']
      result = CreditCardUpdateService.new(params[:id], session_id, params).run
      if result.is_a?(Hash) && result[:error].present?
        render json:{ status: 500, error: result[:error]}.to_json
        # render js: "alert('#{result[:error]}'); hideLoading()"
      else
        render json:{ status: :ok}.to_json
        # render js: 'location.reload()'
      end
    end
  end
end
