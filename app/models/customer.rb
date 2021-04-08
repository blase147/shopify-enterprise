class Customer < ApplicationRecord
  enum gender: [:male, :female]

  mount_uploader :avatar, AvatarUploader
  has_many :additional_contacts, dependent: :destroy
  has_one :billing_address

  # validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  # validates :email, presence: true
  accepts_nested_attributes_for :additional_contacts,
  reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :billing_address,
  reject_if: :all_blank, allow_destroy: true

  # default_scope { order(created_at: :asc) }
end
