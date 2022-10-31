class PasswordlessOtp < ApplicationRecord
    validates :email, uniqueness: true
end
