class SendRebuyEmailNotificationsWorker
    include Sidekiq::Worker  
    sidekiq_options :retry => 3, :dead => false
    def perform(shop_id,customer_notifications)
        customer_notifications = JSON.parse(customer_notifications) rescue nil
        customer_notifications&.each do |customer_notification|
            sent = RebuyService.new(shop_id).send_email_and_sms(customer_notification["customer_id"], customer_notification["token"]) rescue nil
        end
    end
end