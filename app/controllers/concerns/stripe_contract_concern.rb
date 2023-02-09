module StripeContractConcern
    extend ActiveSupport::Concern
    def stripe_checkout
        init_stripe
        shop = Shop.find_by_shopify_domain(params[:shopify_domain])
    
        stripe_contract = StripeContract.find(params[:contract_id])
        stripe_product = Stripe::Product.retrieve(stripe_contract&.stripe_product_id)
        stripe_price = Stripe::Price.retrieve(stripe_product&.default_price)
        stripe_customer = Stripe::Customer.list({email: params[:customer_email]})&.data&.first
    
        url = "https://#{shop.shopify_domain}/a/chargezen/contract/#{params[:token]}?redirect_url=#{params[:redirect_url]}&"
        success_url = url + "stripe_response=success&contract_id=#{params[:contract_id]}"
        cancel_url = url + "stripe_response=failed&contract_id=#{params[:contract_id]}"
        payment_mode = stripe_price.type == "recurring" ? 'subscription' : "payment"
    
        stripe_checkout = Stripe::Checkout::Session.create({
          success_url:  success_url,
          line_items: [
            {price: stripe_price&.id, quantity: 1},
          ],
          customer: stripe_customer&.id,
          cancel_url: cancel_url,
          mode: payment_mode,
        })
        render json:{status: :ok, checkout_url: stripe_checkout&.url }
      end
end