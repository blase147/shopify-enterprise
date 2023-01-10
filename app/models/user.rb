class User < ApplicationRecord
     # Include default devise modules. Others available are:
     # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
    devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
    # Include default devise modules. Others available are:
    # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
    devise :database_authenticatable, :registerable,
            :recoverable, :rememberable, :validatable

    has_one :user_shop
    has_one :user_shop_child
    has_many :shop_users, dependent: :destroy
    scope :search, -> (query) { where("lower(first_name) like :s OR lower(last_name) like :s OR lower(first_name) || ' ' || lower(last_name) like :s OR lower(email) like :s", :s=> "#{query&.downcase}%")&.limit(20) }
    def full_name
        "#{first_name} #{last_name}"
    end
end