class SiteLog < ApplicationRecord
  TYPES = {
    shopify_webhook: "Shopify Webhook",
    sidekiq_job_failure: "Sidekiq Job Failure",
    cron_job: "Cron job",
    email_failure: "Account activation Email Failure",
    email_success: "Account activation Email Success"
  }
end
