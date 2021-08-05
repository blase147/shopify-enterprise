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

every 1.minutes do
  rake 'subscriptions:expire_conversation'
end

every 10.minutes do
  rake 'subscriptions:opt_in_success'
end

every 1.days do
  rake 'subscriptions:renewal_reminder'
end

every 1.hours do
  rake 'orders:sync_orders'
end
