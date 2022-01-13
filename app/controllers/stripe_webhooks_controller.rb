class StripeWebhooksController < ActionController::Base
  skip_before_action :verify_authenticity_token

  def subscription
    payload = request.body.read
    sig_header = request.env['HTTP_STRIPE_SIGNATURE']
    event = nil

    begin
      event = Stripe::Webhook.construct_event(
        payload, sig_header, ENV['STRIPE_ENDPOINT_SECRET']
      )
    rescue JSON::ParserError => e
      # Invalid payload
      status 400
      return
    rescue Stripe::SignatureVerificationError => e
      # Invalid signature
      status 400
      return
    end

    # Handle the event
    case event.type
    when 'customer.subscription.deleted'
      subscription = event.data.object
      csc = CustomerSubscriptionContract.find_by(api_resource_id: subscription.id)
      if csc
        csc.update(status: 'CANCELLED', api_data: subscription.to_h)
      end
    when 'customer.subscription.updated'
      subscription = event.data.object
      csc = CustomerSubscriptionContract.find_by(api_resource_id: subscription.id)
      if csc
        csc.update(api_data: subscription.to_h)
      end
    when 'invoice.payment_succeeded'
      subscription = event.data.object.subscription
      if event.data.object.total > 100
        csc = CustomerSubscriptionContract.find_by(api_resource_id: subscription)
        Stripe::OrderCreate.new(csc).create
      else
        puts "OrderCreate rejected: total=$#{event.data.object.total/100.to_f}"
      end
    else
      puts "Unhandled event type: #{event.type}"
    end

    head :no_content
  end
end

=begin

webhooks.each do |webhook|
  if webhook.address.include?('ngrok')
    webhook.address.gsub!('https://98f6-72-255-40-54.ngrok.io/', ENV['HOST'])
    webhook.save
  end
end

=end
