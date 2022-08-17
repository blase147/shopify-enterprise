class ScheduleEmailWorker
    include Sidekiq::Worker

    sidekiq_retry_in do |count|
      43200
    end
  
    def perform(email_name, contract_id)
        if email_name === "changes_reminder"
            SendEmailService.new.send_changes_reminder_email(contract_id)
        end
    end
end