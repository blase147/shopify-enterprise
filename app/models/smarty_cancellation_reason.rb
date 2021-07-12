class SmartyCancellationReason < ApplicationRecord
  enum winback: [:not_defined, :swap, :skip]
  belongs_to :shop
end
