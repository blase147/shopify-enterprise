# frozen_string_literal: true

# To calculate analytics for sms
class SmsAnalyticsService
  OPT_OUT_KEYWORDS = %w[cancel quit stop unsubscribe end stopall].freeze
  def initialize(shop, range, messages)
    @range = range
    @shop = shop
    @messages = messages
  end

  def percentage(past_data, new_data, original_data)
    percent = Percentage.change(past_data.to_f, new_data.to_f).to_i rescue 0
    { value: original_data.to_f.round(2), percent: percent, up: percent.positive? }
  end

  def swap_count
    @shop.subscription_logs.sms.swap.where('created_at::date BETWEEN ? AND ?', @range.first, @range.last).count
  end

  def skip_count
    @shop.subscription_logs.sms.skip.where('created_at::date BETWEEN ? AND ?', @range.first, @range.last).count
  end

  def delay_count
    @shop.subscription_logs.sms.delay.where('created_at::date BETWEEN ? AND ?', @range.first, @range.last).count
  end

  def cancel_count
    @shop.subscription_logs.sms.cancel.where('created_at::date BETWEEN ? AND ?', @range.first, @range.last).count
  end

  def one_time_revenue
    @shop.subscription_logs.sms.one_time_order.where('created_at::date BETWEEN ? AND ?', @range.first, @range.last).sum(:revenue)
  end

  def opt_out_messages
    @messages.count { |message| OPT_OUT_KEYWORDS.include?(message.body.downcase.strip) }
  end

  def messages_by_direction(direction, range)
    @messages.count { |message| message.direction.eql?(direction) && range.cover?(message.date_created.to_date) }
  end

  def messages(range)
    inbound_sms_count = messages_by_direction('inbound', range)
    outbound_sms_count = messages_by_direction('outbound-api', range)
    {
      inbound_sms: inbound_sms_count,
      outbound_sms: outbound_sms_count,
      total_sms: inbound_sms_count + outbound_sms_count
    }
  end

  def most_swaped_product
    swaped_product = @shop.subscription_logs.sms.swap.where('created_at::date BETWEEN ? AND ?', @range.first, @range.last)
                           .select('COUNT(*) AS log_count, subscription_logs.product_id').group(:product_id, :id)
                           .order('log_count DESC')
                           .limit(1).first
    return unless swaped_product.present?

    product = ShopifyAPI::Product.find(swaped_product.product_id, params: { fields: 'id,title,image' })
    { product_id: product.id, title: product.title, image: product.image.src }
  end

  def most_skipped_product
    skipped_product = @shop.subscription_logs.sms.skip.where('created_at::date BETWEEN ? AND ?', @range.first, @range.last)
                           .select('COUNT(*) AS log_count, subscription_logs.product_id').group(:product_id, :id)
                           .order('log_count DESC')
                           .limit(1).first
    return unless skipped_product.present?

    product = ShopifyAPI::Product.find(skipped_product.product_id, params: { fields: 'id,title,image' })
    { product_id: product.id, title: product.title, image: product.image.src }
  end

  def most_swaped_product_to
    swaped_product = @shop.subscription_logs.sms.swap.where('created_at::date BETWEEN ? AND ?', @range.first, @range.last)
                          .select('COUNT(*) AS log_count, subscription_logs.swaped_product_id')
                          .group(:swaped_product_id, :id)
                          .order('log_count DESC')
                          .limit(1).first
    return unless swaped_product.present?

    product = ShopifyAPI::Product.find(swaped_product.swaped_product_id, params: { fields: 'id,title,image' })
    { product_id: product.id, title: product.title, image: product.image.src }
  end

  def graph_data_by_granularity(method)
    @range.map(&"beginning_of_#{granularity}".to_sym).uniq.map do |date|
      {
        date: date.strftime(granularity == 'year' ? '%Y' : '%b %d'),
        data: send(method, date.instance_eval("beginning_of_#{granularity}")..date.instance_eval("end_of_#{granularity}"))
      }
    end
  end

  def granularity
    range = 'day'
    if @range.count > 31
      range = 'month'
    elsif @range.count > 365
      range = 'year'
    end
    range
  end
end
