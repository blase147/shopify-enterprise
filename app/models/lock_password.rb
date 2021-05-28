class LockPassword < ApplicationRecord
  has_secure_password :password
end
