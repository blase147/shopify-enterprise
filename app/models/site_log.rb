class SiteLog < ApplicationRecord
  TYPES = {
    shopify_webhook: "Shopify Webhook",
    sidekiq_job_failure: "Sidekiq Job Failure",
    cron_job: "Cron job",
    email_failure: "Email Failure",
    email_success: "Email Success"
  }
end
