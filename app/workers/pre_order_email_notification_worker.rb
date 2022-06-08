class PreOrderEmailNotificationWorker
  include Sidekiq::Worker

  def perform
    # Send email
  end
end