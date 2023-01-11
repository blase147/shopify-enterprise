class UserShop < ApplicationRecord
    belongs_to :user
    belongs_to :shop
    validates :user_id, presence: true, uniqueness: { scope: :shop_id }
    enum role: {"admin": "admin", "staff": "staff"}
end