class CustomerSubscriptionContract < ApplicationRecord
  enum gender: [:male, :female]
  belongs_to :shop, foreign_key: :shop_id
  belongs_to :reasons_cancel, optional: true
  mount_uploader :avatar, AvatarUploader
  has_many :additional_contacts, foreign_key: 'customer_id', dependent: :destroy
  has_one :billing_address, foreign_key: 'customer_id', dependent: :destroy
  has_many :sms_conversations, foreign_key: 'customer_id', dependent: :destroy
  # has_many :sms_logs, dependent: :destroy
  has_many :subscription_logs, foreign_key: 'customer_id', dependent: :destroy

  # validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  # validates :email, presence: true
  accepts_nested_attributes_for :additional_contacts,
  reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :billing_address,
  reject_if: :all_blank, allow_destroy: true

  after_create :send_opt_in_sms, unless: -> { opt_in_sent }
  after_create :activation_email
  after_create :charge_store
  # default_scope { order(created_at: :asc) }

  def log_work
    begin
      subscription = SubscriptionContractService.new(shopify_id).run
      product = subscription.lines.edges.collect{|c| c.node}.first
      note = "Subscription - " + subscription.billing_policy.interval_count.to_s + " " + subscription.billing_policy.interval
      description = self.name+",purchased,"+product.title
      amount = (product.quantity * product.current_price.amount.to_f).round(2).to_s
      shop.subscription_logs.opt_in.sms.create(subscription_id: shopify_id, customer_id: id, product_name: product.title, note: note, description: description, amount: amount, product_id: product.id)
    rescue
      true
    end
  end

  def send_opt_in_sms
    return if !shop.sms_setting.present? && !shop.sms_setting&.opt_in

    shop.connect
    message_service = SmsService::MessageGenerateService.new(shop, self, nil)
    message = message_service.content('Opt-in')
    if phone.present? && shop.phone.present?
      TwilioServices::SendSms.call(from: shop.phone, to: phone, message: message)
      # shop.sms_logs.opt_in.create(customer_id: id)
      # shop.subscription_logs.opt_in.sms.create(customer_id: id)
      log_work
      update(opt_in_sent: true, opt_in_reminder_at: Time.current + 12.hours)
    end
  end

  def activation_email
    email_notification = shop.setting.email_notifications.find_by_name "Subscription Activation"
    EmailService::Send.new(email_notification).send_email({customer: self}) if email_notification.present? && shop.setting.email_service.present?
  end

  def charge_store
    if ENV['APP_TYPE'] == 'public'
      subscription = SubscriptionContractService.new(shopify_id).run
      StoreChargeService.new(shop).create_usage_charge(subscription)
    end
  end

  def name
    self.first_name.to_s + " " + self.last_name.to_s
  end

  def shopify_identity
    "gid://shopify/SubscriptionContract/#{shopify_id}"
  end

  def self.to_csv(customer_id, save_path)
    attributes = %w{id first_name last_name email phone communication subscription language}
    customers = CustomerSubscriptionContract.where(shopify_customer_id: customer_id)

    CSV.open(save_path, 'wb') do |csv|
      csv << attributes

      customers.each do |customer|
        csv << attributes.map { |attr| customer.send(attr) }
      end
    end
  end

  def self.update_contracts(customer_id, shop)
    items = CustomerSubscriptionContractsService.new(customer_id).run
    items[:subscriptions].each do |item|
      billing_policy = item.billing_policy

      customer = shop.customer_subscription_contracts.find_or_create_by(shopify_id: item.id[/\d+/])
      customer.update_columns(
        first_name: item.customer.first_name,
        last_name: item.customer.last_name,
        email: item.customer.email,
        phone: item.customer.phone,
        shopify_at: item.created_at.to_date,
        shopify_updated_at: item.updated_at&.to_date,
        status: item.status,
        subscription: item.lines.edges.first&.node&.title,
        language: "$#{item.lines.edges.first&.node&.current_price&.amount} / #{billing_policy.interval.pluralize}",
        communication: "#{billing_policy.interval_count} #{billing_policy.interval} Pack".titleize,
        shopify_customer_id: item.customer.id[/\d+/]
      )
    end if (items && items[:subscriptions] rescue false)
  end
end
