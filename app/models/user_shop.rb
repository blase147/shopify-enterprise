class UserShop < ApplicationRecord
    belongs_to :user
    has_many :user_shop_children
    has_many :shops
end