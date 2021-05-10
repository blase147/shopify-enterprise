every 1.days do
  rake "subscriptions:attemp_billing"
end

every 1.minute do
  rake "subscriptions:expire_conversation"
end

every 10.minute do
  rake "subscriptions:opt_in_success"
end
