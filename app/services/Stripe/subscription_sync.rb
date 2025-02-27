class Stripe::SubscriptionSync
  PRODUCT_MAP = {
    'Boho Chic' => {id: 4647218872406, variants: {'Quarterly' => 40487816724651, 'Annual' => 40487829536939}},
    'Classic Woman' => {id: 4660568817750, variants: {'Quarterly' => 40487836680363, 'Annual' => 40487838744747}},
    'Everyday Fashionista' => {id: 4617478766678, variants: {'Quarterly' => 40487846379691, 'Annual' => 40487849132203}}
  }

  def self.run(shop, stripe_subscription)
    csc = CustomerSubscriptionContract.find_by(api_resource_id: stripe_subscription.id)
    if csc
      csc.assign_attributes(
        api_data: stripe_subscription.to_h,
        status: ((stripe_subscription.pause_collection.present? && 'PAUSED') || (stripe_subscription.status == 'canceled' && 'CANCELLED') || 'ACTIVE'),
        language: "$#{stripe_subscription.items.data.first.price.unit_amount/100.to_f} / #{stripe_subscription.plan.interval_count} #{stripe_subscription.plan.interval}",
        communication: "#{stripe_subscription.plan.interval_count} #{stripe_subscription.plan.interval} Pack".titleize
      )
      csc.import_data.merge({
        price: stripe_subscription.items.data.first.price.unit_amount/100.to_f,
        interval_number: stripe_subscription.plan.interval_count,
        interval_type: stripe_subscription.plan.interval.upcase,
      })
      csc.save
    else
      stripe_product = Stripe::Product.retrieve(stripe_subscription.plan.product, {api_key: shop.stripe_api_key})
      stripe_customer = Stripe::Customer.retrieve(stripe_subscription.customer, {api_key: shop.stripe_api_key})
      shopify_customer = ShopifyAPI::Customer.find(:first, params: {email: stripe_customer.email})

      raise "Skipping::::#{stripe_customer.email} not exists: #{shopify_customer}" if shopify_customer.nil?
      begin
        shopify_customer_address = shopify_customer.default_address
      rescue
        shopify_customer_address = nil
      end
      product_title, variant_title = stripe_product.name.split(', ')


      csc = CustomerSubscriptionContract.new(
        shopify_customer_id: shopify_customer.id,
        first_name: shopify_customer.first_name,
        last_name: shopify_customer.last_name,
        email: shopify_customer.email,
        phone: shopify_customer.phone,
        shopify_at: Time.at(stripe_subscription.created),
        shopify_updated_at: Time.at(stripe_subscription.created),
        status: ((stripe_subscription.pause_collection.present? && 'PAUSED' ) || (stripe_subscription.status == 'canceled' && 'CANCELLED') || 'ACTIVE'),
        subscription: stripe_product.name,
        language: "$#{stripe_subscription.items.data.first.price.unit_amount/100.to_f} / #{stripe_subscription.plan.interval_count} #{stripe_subscription.plan.interval}",
        communication: "#{stripe_subscription.plan.interval_count} #{stripe_subscription.plan.interval} Pack".titleize,
        shop_id: shop.id,
        api_source: 'stripe',
        import_data: {
          first_name: shopify_customer.first_name,
          last_name: shopify_customer.last_name,
          customer_email: shopify_customer.email,
          product_title: product_title,
          price: stripe_subscription.items.data.first.price.unit_amount/100.to_f,
          product_id: PRODUCT_MAP[product_title].nil? ? '' :  PRODUCT_MAP[product_title][:id],
          variant_id:PRODUCT_MAP[product_title].nil? ?  '' : PRODUCT_MAP[product_title][:variants][variant_title],
          quantity: stripe_subscription.items.data.first.quantity,
          address1: shopify_customer_address.nil? ? '' : shopify_customer_address&.address1,
          address2: shopify_customer_address.nil? ? '' : shopify_customer_address&.address2,
          city: shopify_customer_address.nil? ? '' : shopify_customer_address&.city,
          province: shopify_customer_address.nil? ? '' : shopify_customer_address&.province,
          zip: shopify_customer_address.nil? ? '' : shopify_customer_address&.zip,
          country: shopify_customer_address.nil? ? '' : shopify_customer_address&.country,
          interval_number: stripe_subscription.plan.interval_count,
          interval_type: stripe_subscription.plan.interval.upcase,
          purchase_date: Time.at(stripe_subscription.created),
          stripe_customer_id: !stripe_customer.nil? && !stripe_customer.id.nil? ? stripe_customer.id : ''
        },
        import_type: 'stripe_subscription',
        api_data: stripe_subscription.to_h,
        api_resource_id: stripe_subscription.id
      )
      csc.save
    end
  rescue => e
    puts "Error syncing subscription #{stripe_subscription.id}"
    puts e
    puts ([e.message]+e.backtrace).join($/)
  end
end
