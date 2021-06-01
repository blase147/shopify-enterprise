module Queries
  class FetchSmsAnalytics < Queries::BaseQuery
    type Types::SmsAnalyticType, null: false
    argument :start_date, String, required: true
    argument :end_date, String, required: true

    def resolve(start_date:, end_date:)
      range = start_date.to_date..end_date.to_date
      past_day_range = Date.today - 1.day..Date.today - 1.day
      current_day_range = Date.today..Date.today
      messages = $twilio_client.messages.list(date_sent_after: range.first, date_sent_before: range.last)
      past_day_messages = $twilio_client.messages.list(date_sent_after: past_day_range.first, date_sent_before: past_day_range.last)
      current_day_messages = $twilio_client.messages.list(date_sent_after: current_day_range.first, date_sent_before: current_day_range.last)
      sms_analytics = SmsAnalyticsService.new(current_shop, range, messages)
      sms_analytics_past = SmsAnalyticsService.new(current_shop, past_day_range, past_day_messages)
      sms_analytics_current = SmsAnalyticsService.new(current_shop, current_day_range, current_day_messages)
      swap_count = sms_analytics.percentage(sms_analytics_past.swap_count, sms_analytics_current.swap_count, sms_analytics.swap_count)
      skip_count = sms_analytics.percentage(sms_analytics_past.skip_count, sms_analytics_current.skip_count, sms_analytics.skip_count)
      delay_count = sms_analytics.percentage(sms_analytics_past.delay_count, sms_analytics_current.delay_count, sms_analytics.delay_count)
      one_time_revenue = sms_analytics.percentage(sms_analytics_past.one_time_revenue, sms_analytics_current.one_time_revenue, sms_analytics.one_time_revenue)
      inbound_sms = sms_analytics.messages_by_direction('inbound')
      outbound_sms = sms_analytics.messages_by_direction('outbound-api')
      opt_out_messages = sms_analytics.opt_out_messages.count
      most_swaped_product = sms_analytics.most_swaped_product
      most_swaped_product_to = sms_analytics.most_swaped_product_to
      most_skipped_product = sms_analytics.most_skipped_product
      { swap_count: swap_count, skip_count: skip_count, delay_count: delay_count, one_time_revenue: one_time_revenue,
        total_sms: messages.count, inbound_sms: inbound_sms, outbound_sms: outbound_sms,
        most_swaped_product: most_swaped_product, most_skipped_product: most_skipped_product,
        most_swaped_product_to: most_swaped_product_to, opt_out_messages: opt_out_messages }
    end
  end
end
