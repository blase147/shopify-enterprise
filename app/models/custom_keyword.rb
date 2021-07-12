class CustomKeyword < ApplicationRecord
  enum status: [:active, :inactive]
end
