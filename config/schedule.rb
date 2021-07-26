set :output, "log/cron_log.log"
require_relative './environment'

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
