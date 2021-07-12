class SmsMessage < ApplicationRecord
  belongs_to :sms_conversation
  before_save :set_conversation_activity

  def set_conversation_activity
    sms_conversation.update(last_activity_at: Time.current)
  end
end
