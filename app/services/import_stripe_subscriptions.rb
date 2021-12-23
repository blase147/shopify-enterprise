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
      calc_price = ((row['price'].to_f rescue 0)+ (row['shipping_price'].to_f rescue 0)).round(2) * 100
      stripe_subscription = Stripe::Subscription.create({
        customer: row['customer_gateway_token'],
        billing_cycle_anchor: anchor,
        proration_behavior: 'none',
        items: [
          {
            price_data: {
              unit_amount_decimal: calc_price,
              currency: 'usd',
              recurring: {
                interval: row['interval_type']&.downcase&.singularize,
                interval_count: row['interval_number']
              },
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


=begin

csv_path = './recurring_orders_inactive_customer_export_2021-12-06.csv'
csv = CSV.parse(File.read(csv_path), headers: true)

subscription_ids = csv.pluck("Subscription ID")

active = 0
list = []
CustomerSubscriptionContract.where(api_source: 'stripe', status: 'ACTIVE').each do |csc|
  if subscription_ids.include?(csc.import_data['order_id'])
    active += 1
    list << csc
  end
end
active

list.each do |csc|
  if csc.status == 'ACTIVE'
    Stripe::Subscription.delete(
      csc.api_data['id'], nil,
      {api_key: shop.stripe_api_key}
    )
    csc.update(status:  'CANCELLED')
  end
end
=end


=begin

tally = {found: 0, not_found: 0}
not_found = []
shop = Shop.find_by(shopify_domain: 'bagamour.myshopify.com')
shop.customer_subscription_contracts.where(api_source: 'stripe', status: 'ACTIVE').each do |contract|
  if contract.api_data.present?
    selling_plan = if contract.import_data['variant_title']&.include?('Annual')
      SellingPlan.find(7)
    else
      SellingPlan.find(3)
    end
    calc_price = (((contract.import_data['price'].to_f rescue 0)+ (contract.import_data['shipping_price'].to_f rescue 0)).round(2) * 100).to_i
    unless calc_price == contract.api_data['items']['data'][0]['price']['unit_amount']
      price = Stripe::Price.create({
        recurring: {interval: selling_plan.interval_type.downcase, interval_count: selling_plan.interval_count},
        unit_amount: calc_price,
        currency: 'usd',
        product: contract.api_data['items']['data'][0]['price']['product']
      }, { api_key: shop.stripe_api_key })
      subscription = Stripe::Subscription.update(
        contract.api_resource_id,
        {
          proration_behavior: 'none',
          items: [
            {
              id: contract.api_data['items']['data'][0]['id'],
              price: price.id
            }
          ]
        },
        { api_key: shop.stripe_api_key }
      )
      contract.api_data = subscription.to_h
      contract.save
    end
  end
rescue => e
  puts e
  puts contract.id
end

BAGAMOUR_ANCHOR = Date.parse('2021-11-01')
def next_anchor(selling_plan)
  anchor = BAGAMOUR_ANCHOR
  today = Date.today
  interval = selling_plan.interval_count.to_i.public_send(selling_plan.interval_type.downcase)
  while anchor < today
    anchor += interval
  end
  anchor.to_datetime.to_i
end
selling_plan = SellingPlan.find(3)
count = 0
shop.customer_subscription_contracts.where(api_resource_id: ids).each do |contract|
  product = Stripe::Product.create({name: "#{contract.import_data['product_title']}, #{contract.import_data['variant_title']}"}, { api_key: shop.stripe_api_key })
  anchor = next_anchor(selling_plan)
  calc_price = (((contract.import_data['price'].to_f rescue 0) + (contract.import_data['shipping_price'].to_f rescue 0)).round(2) * 100).to_i
  stripe_subscription = Stripe::Subscription.create({
    customer: contract.import_data['customer_gateway_token'],
    billing_cycle_anchor: anchor,
    items: [
      {
        price_data: {
          unit_amount_decimal: calc_price,
          currency: 'usd',
          recurring: {
            interval: selling_plan.interval_type.downcase,
            interval_count: selling_plan.interval_count
          },
          product: product.id
        }
      }
    ]
  }, { api_key: shop.stripe_api_key })
  contract.api_resource_id = stripe_subscription.id
  contract.api_data = stripe_subscription.to_h
  contract.save
rescue => e
  count +=1
  puts e
  puts contract.id
end

=end

=begin

Stripe::Subscription.update(
  'sub_1K187JK3XXGN7m9uzWWUxVN5',
  {
    trial_end: 1667242800,
    proration_behavior: 'none',
  },
  {
    api_key: shop.stripe_api_key
  }
)

subs.each do |sub|
  csc = CustomerSubscriptionContract.where("import_data->>'order_id' = ?", sub).first
  if csc&.api_resource_id
    Stripe::Subscription.update(
      csc.api_resource_id,
      {
        trial_end: 1651345200,
        proration_behavior: 'none',
      },
      {
        api_key: shop.stripe_api_key
      }
    )
  end
end

=end


=begin

tally = {found: 0, not_found: 0}
not_found = []
shop = Shop.find_by(shopify_domain: 'bagamour.myshopify.com')
shop.customer_subscription_contracts.where(api_source: 'stripe', status: 'ACTIVE').each do |contract|
if contract.import_data.present?
    selling_plan = if contract.import_data['variant_title']&.include?('Annual')
      SellingPlan.find(7)
    else
      SellingPlan.find(3)
    end
    contract.update(selling_plan_id: selling_plan.id)
  end
end

=end

=begin
count = 0
shop = Shop.find_by(shopify_domain: 'bagamour.myshopify.com')
shop.customer_subscription_contracts.where(api_source: 'stripe', status: 'ACTIVE').each do |contract|
  stripe_subscription = Stripe::Subscription.retrieve(contract.api_resource_id, {api_key: shop.stripe_api_key})
  if stripe_subscription.status == 'canceled' && contract.status != 'CANCELLED'
    count += 1
    contract.update(
      cancelled_at: stripe_subscription.canceled_at,
      status: 'CANCELLED',
      api_data: stripe_subscription.to_h
    )
  end
rescue => e
  puts e
  next
end

shop.customer_subscription_contracts.where.gt(updated_at: 1.hour.ago).count

=end

=begin

shop = Shop.find_by(shopify_domain: 'bagamour.myshopify.com')
shop.customer_subscription_contracts.where(api_source: 'stripe', status: 'ACTIVE').each do |contract|
  if contract.api_data.present?
    calc_price = if contract.selling_plan_id == '7'
      5499
    elsif contract.selling_plan_id == '3'
      5999
    end
    selling_plan = SellingPlan.find contract.selling_plan_id
    unless calc_price == contract.api_data['items']['data'][0]['price']['unit_amount']
      price = Stripe::Price.create({
        recurring: {interval: selling_plan.interval_type.downcase, interval_count: selling_plan.interval_count},
        unit_amount: calc_price,
        currency: 'usd',
        product: contract.api_data['items']['data'][0]['price']['product']
      }, { api_key: shop.stripe_api_key })
      subscription = Stripe::Subscription.update(
        contract.api_resource_id,
        {
          proration_behavior: 'none',
          items: [
            {
              id: contract.api_data['items']['data'][0]['id'],
              price: price.id
            }
          ]
        },
        { api_key: shop.stripe_api_key }
      )
      contract.api_data = subscription.to_h
      contract.save
    end
  end
rescue => e
  puts e
  puts contract.id
end

=end

# shop = Shop.find_by(shopify_domain: 'bagamour.myshopify.com')
# shop.customer_subscription_contracts.where(api_source: 'stripe', status: 'ACTIVE').pluck(:shopify_customer_id).uniq.size


=begin

subs = ['6425090', '6494842', '6663278', '6766114', '6963006']

subs.each do |sub|
  csc = CustomerSubscriptionContract.where("import_data->>'order_id' = ?", sub).first
  if csc&.api_resource_id
    Stripe::Charge.create({
      amount: 5499,
      currency: 'usd',
      customer: 'cus_InMCGIuzHCmll4'
    }, {api_key: shop.stripe_api_key})
  end
end

=end


=begin


emails = ["mindygp1@comcast.net", "jenn1000@hotmail.com", "michelekel@solsticedesigns.com", "stephaniemartin2015@gmail.com", "lovelylou52@gmail.com"]

emails.each do |email|
  csc = CustomerSubscriptionContract.find_by(email: email)
  csc.import_data['is_paused'] = 0
  csc.import_data['active'] = 1
  csc.status = 'ACTIVE'
  row = csc.import_data
  if csc.status == 'ACTIVE'
    product = Stripe::Product.create({name: "#{row['product_title']}, #{row['variant_title']}"}, { api_key: @shop.stripe_api_key })
    anchor = ImportStripeSubscriptions.new(nil,nil).next_anchor(row)
    selling_plan = if csc.import_data['variant_title']&.include?('Annual')
      SellingPlan.find(7)
    else
      SellingPlan.find(3)
    end
    csc.update(selling_plan_id: selling_plan.id)
    calc_price = if csc.selling_plan_id == '7'
      5499
    elsif csc.selling_plan_id == '3'
      5999
    end

    stripe_subscription = Stripe::Subscription.create({
      customer: row['customer_gateway_token'],
      billing_cycle_anchor: anchor,
      items: [
        {
          price_data: {
            unit_amount_decimal: calc_price,
            currency: 'usd',
            recurring: {
              interval: row['interval_type']&.downcase&.singularize,
              interval_count: row['interval_number']
            },
            product: product.id
          }
        }
      ],
      proration_behavior: 'none'
    }, { api_key: @shop.stripe_api_key })

    csc.api_resource_id = stripe_subscription.id
    csc.api_data = stripe_subscription.to_h
  else
    csc.api_data = {}
  end
  csc.save
rescue => e
  puts e
  puts email
end


=end
