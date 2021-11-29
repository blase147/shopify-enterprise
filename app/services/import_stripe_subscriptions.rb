class ImportStripeSubscriptions
  BAGAMOUR_ANCHOR = Date.parse('2021-11-01')

  def initialize(shop, csv_path)
    @shop = shop
    @csv_path = csv_path
  end

  def run
    # implement
    puts "Implement me"
    csv = CSV.parse(File.read(@csv_path), headers: true)

    stubbins = nil
    csv.each do |row|
      stubbins = row if row["customer_gateway_token"] == 'cus_KMgQDDKZHln2jR'
    end
    process_row(stubbins)
  end

  def process_row(row)
    csc = CustomerSubscriptionContract.new(
      shopify_customer_id: row['shopify_customer_id'],
      first_name: row['first_name'],
      last_name: row['last_name'],
      email: row['customer_email'],
      phone: row['phone'],
      shopify_at: row['purchase_date'],
      shopify_updated_at: row['to_date'],
      status: (row['active'] == '1' && 'ACTIVE') || (row['is_paused']),
      subscription: row['variant_title'],
      language: "$#{row['price']} / #{row['interval_number']} #{row['interval_type']}",
      communication: "#{row['interval_number']} #{row['interval_type']} Pack".titleize,
      shop_id: @shop.id
    )
    if csc.status == 'ACTIVE' && row['price'].to_f > 0
      product = Stripe::Product.create({name: "#{row['product_title']}, #{row['variant_title']}"}, { api_key: @shop.stripe_api_key })
      anchor = next_anchor(row)
      stripe_subscription = Stripe::Subscription.create({
        customer: row['customer_gateway_token'],
        items: [
          {
            price_data: {
              unit_amount_decimal: (row['price'].to_f + (row['shipping_price'].to_f rescue 0)),
              currency: 'usd',
              recurring: {interval: row['interval_type']&.downcase&.singularize, interval_count: row['interval_number']},
              product: product.id
            }
          }
        ]

      }, { api_key: @shop.stripe_api_key })
      csc.api_resource_id = stripe_subscription.id
      csc.api_data = stripe_subscription.to_h
      csc.api_source = 'stripe'
    end
    csc.save
  end

  def next_anchor(row)
    anchor = BAGAMOUR_ANCHOR
    today = Date.today
    interval = row['interval_number'].to_i.public_send(row['interval_type'].downcase)
    while anchor < today
      anchor += interval
    end
    anchor.to_datetime.to_i
  end

end

=begin

shop = Shop.find(2)
csv_path = Dir.pwd + '/public/ro_export_2021-11-16 4.csv'
ImportStripeSubscriptions.new(shop, csv_path).run

=end
