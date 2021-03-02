namespace :subscriptions do
  task :attemp_billing => :environment do
    Shop.find_each do |shop|
      shop.connect
      
      has_next_page = true
      next_cursor = nil

      while has_next_page
        data = SubscriptionContractsService.new.run next_cursor
        subscriptions = data[:subscriptions] || []
        
        subscriptions.each do |subscription|
          process_subscription(subscription.node)
        end

        has_next_page = data[:has_next_page]
        next_cursor = data[:next_cursor]
      end
    end
  end

  def process_subscription subscription
    return unless subscription.status == 'ACTIVE'

    id = subscription.id
    billing_date = DateTime.parse subscription.next_billing_date

    if billing_date.utc.beginning_of_day == Time.current.utc.beginning_of_day
      SubscriptionBillingAttempService.new(id).run
      ScheduleSkipService.new(id[/\d+/]).run
    end
  rescue Exception => ex
    p ex.message
  end
end