class Customer < ApplicationRecord
  enum gender: [:male, :female]
  belongs_to :shop, foreign_key: :shop_id
  mount_uploader :avatar, AvatarUploader
  has_many :additional_contacts, dependent: :destroy
  has_one :billing_address
  has_many :sms_conversations

  # validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  # validates :email, presence: true
  accepts_nested_attributes_for :additional_contacts,
  reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :billing_address,
  reject_if: :all_blank, allow_destroy: true

  after_create :send_opt_in_sms, unless: -> { opt_in_sent }

  # default_scope { order(created_at: :asc) }

  def send_opt_in_sms
    if shop.sms_setting.present? && shop.sms_setting&.opt_in
      shop.connect
      message_service = SmsService::MessageGenerateService.new(shop, self, nil)
      message = message_service.content('Opt-in')
      if phone.present? && shop.phone.present?
        TwilioServices::SendSms.call(from: shop.phone, to: phone, message: message)
        self.update(opt_in_sent: true, opt_in_reminder_at: Time.current + 12.hours)
      end
    end
  end

  def shopify_identity
    "gid://shopify/Customer/#{shopify_id}"
  end
end
