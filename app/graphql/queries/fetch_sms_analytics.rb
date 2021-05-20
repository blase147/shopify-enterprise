module Queries
  class FetchSmsAnalytics < Queries::BaseQuery
    type type Types::SmsAnalyticType, null: false
    argument :duration, String, required: true

    def resolve(duration:)
      range = date_range(duration)
      past_range = past_range(duration)
      messages = $twilio_client.messages.list(date_sent_after: range.first, date_sent_before: range.last)
      past_messages = $twilio_client.messages.list(date_sent_after: past_range.first, date_sent_before: past_range.last)
      sms_analytics = SmsAnalyticsService.new(current_shop, range, messages)
      sms_analytics_past = SmsAnalyticsService.new(current_shop, past_range, past_messages)
      swap_count = sms_analytics.percentage(sms_analytics_past.swap_count, sms_analytics.swap_count)
      skip_count = sms_analytics.percentage(sms_analytics_past.skip_count, sms_analytics.skip_count)
      delay_count = sms_analytics.percentage(sms_analytics_past.delay_count, sms_analytics.delay_count)
      one_time_revenue = sms_analytics.percentage(sms_analytics_past.one_time_revenue, sms_analytics.one_time_revenue)
      inbound_sms = sms_analytics.messages_by_direction('inbound')
      outbound_sms = sms_analytics.messages_by_direction('outbound-api')
      most_swaped_product = sms_analytics.most_swaped_product
      most_swaped_product_to = sms_analytics.most_swaped_product_to
      most_skipped_product = sms_analytics.most_skipped_product
      { swap_count: swap_count, skip_count: skip_count, delay_count: delay_count, one_time_revenue: one_time_revenue,
        total_sms: messages.count, inbound_sms: inbound_sms, outbound_sms: outbound_sms,
        most_swaped_product: most_swaped_product, most_skipped_product: most_skipped_product,
        most_swaped_product_to: most_swaped_product_to }
    end
  end

  def date_range(duration)
    (Date.today - 1.send(duration))..Date.today - 1.day
  end

  def past_range(duration)
    (Date.today - 2.send(duration))..(Date.today - 1.send(duration)) - 1.day
  end
end
