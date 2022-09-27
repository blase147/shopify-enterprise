set :output, 'log/cron_log.log'
env :PATH, ENV['PATH']
set :environment, ENV['RAILS_ENV']


every 4.hours do
  rake 'log:clear'
end

every 1.days do
  rake 'subscriptions:attemp_billing'
  rake 'subscriptions:retries_attemp_billing'
end

# every 1.minutes do
#   rake 'subscriptions:expire_conversation'
# end

# every 10.minutes do
#   rake 'subscriptions:opt_in_success'
# end

every 1.days do
  rake 'subscriptions:renewal_reminder'
end

# every 1.hours do
#  rake 'orders:sync_orders'
# end

# every 39.minutes do
#  rake 'subscriptions:sync_subscription_contracts'
# end

every 1.days do
  rake 'pre_orders:fill_pre_order'
end

every 1.days do
  rake 'subscriptions:save_billing_attempts'
end

every 1.hours do
  rake 'analytics:update_analytics'
end

every :day, at: '10:00pm' do
  CheckNextBillingDateWorker.perform_async
end
