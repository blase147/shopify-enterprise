class EmailNotification < ApplicationRecord
  belongs_to :setting
  default_scope { order(created_at: :asc) }
  after_create :push_template
  after_update :update_template, if: lambda { |e| e.saved_change_to_email_message? || e.saved_change_to_name? }
  before_destroy :remove_template

  def push_template
    EmailService::Klaviyo.new(self).create_template if self.setting.email_service.present? && self.setting.email_service.downcase == "klaviyo"
  end

  def update_template
    EmailService::Klaviyo.new(self).update_template if self.setting.email_service&.downcase == "klaviyo"
  end

  def remove_template
    EmailService::Klaviyo.new(self).delete_template if self.setting.email_service&.downcase == "klaviyo"
  end

end
