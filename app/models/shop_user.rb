class ShopUser < ApplicationRecord
  belongs_to :shop
  belongs_to :user
  has_one :user_shop_child_setting
  enum role: ["admin", "staff"]

end
