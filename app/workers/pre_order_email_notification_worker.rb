class PreOrderEmailNotificationWorker
  include Sidekiq::Worker

  def perform(contract_id, week_number)
        SendEmailService.new.send_fill_preorder_email(contract_id, week_number)
    end

  rescue => e
    params = {contract_id: contract_id}
    message = "#{e.message} from #{e.backtrace.first}"
    SiteLog.create(log_type: SiteLog::TYPES[:sidekiq_job_failure], message: message, params: params)
end
