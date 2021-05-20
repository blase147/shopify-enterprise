class SmsLog < ApplicationRecord
  belongs_to :customer
  belongs_to :shop

  enum action: %i[swap skip delay billing shipping cancel pause restart resume info one_time_order opt_in]
end
