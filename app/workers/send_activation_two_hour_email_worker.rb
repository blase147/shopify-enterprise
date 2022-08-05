class SendActivationTwoHourEmailWorker
    include Sidekiq::Worker
    def perform(contract_id, delivery_date)
        SendEmailService.new.send_subscription_activation_2_hours_email(contract_id, delivery_date)
    end
end