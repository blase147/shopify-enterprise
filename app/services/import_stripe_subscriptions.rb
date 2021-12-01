class ImportStripeSubscriptions
  BAGAMOUR_ANCHOR = Date.parse('2021-11-01')

  def initialize(shop, csv_path)
    @shop = shop
    @csv_path = csv_path
  end

  def run
    csv = CSV.parse(File.read(@csv_path), headers: true)

    csv.each do |row|
      unless CustomerSubscriptionContract.where("import_data->>'order_id' = ?", row['order_id']).first
        process_row(row)
      end
    end
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
      status: ((row['is_paused'] == '1' && 'PAUSED' ) || (row['active'] == '1' && 'ACTIVE') || 'CANCELLED'),
      subscription: row['variant_title'],
      language: "$#{row['price']} / #{row['interval_number']} #{row['interval_type']}",
      communication: "#{row['interval_number']} #{row['interval_type']} Pack".titleize,
      shop_id: @shop.id,
      api_source: 'stripe',
      import_data: row.to_h,
      import_type: 'csv_file'
    )
    if csc.status == 'ACTIVE' && row['price'].to_f > 0
      product = Stripe::Product.create({name: "#{row['product_title']}, #{row['variant_title']}"}, { api_key: @shop.stripe_api_key })
      anchor = next_anchor(row)
      stripe_subscription = Stripe::Subscription.create({
        customer: row['customer_gateway_token'],
        billing_cycle_anchor: anchor,
        items: [
          {
            price_data: {
              unit_amount_decimal: (row['price'].to_f + (row['shipping_price'].to_f rescue 0)).round(3),
              currency: 'usd',
              recurring: {interval: row['interval_type']&.downcase&.singularize, interval_count: row['interval_number']},
              product: product.id
            }
          }
        ]
      }, { api_key: @shop.stripe_api_key })
      csc.api_resource_id = stripe_subscription.id
      csc.api_data = stripe_subscription.to_h
    else
      csc.api_data = {}
    end
    csc.save
  rescue => e
    puts "Error processing #{row['order_id']}"
    p e.message
    p e
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

shop = Shop.find_by(shopify_domain: "bagamour.myshopify.com")
csv_path = Dir.pwd + '/public/ro_export_2021-11-16 4.csv'
csv = CSV.parse(File.read(csv_path), headers: true)
import = ImportStripeSubscriptions.new(shop, csv_path)
import.process_row(csv.first)

shop = Shop.find_by(shopify_domain: "bagamour.myshopify.com")
csv_path = Dir.pwd + '/public/ro_export_2021-11-16 4.csv'
ImportStripeSubscriptions.new(shop, csv_path).run

=end
