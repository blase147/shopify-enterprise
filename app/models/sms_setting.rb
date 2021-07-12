class SmsSetting < ApplicationRecord
  belongs_to :shop
  enum status: [:active, :disable]
end
