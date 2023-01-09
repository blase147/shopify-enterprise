class UserShopChild < ApplicationRecord
    belongs_to :user
    belongs_to :user_shop
    has_one :user_shop_child_setting
end