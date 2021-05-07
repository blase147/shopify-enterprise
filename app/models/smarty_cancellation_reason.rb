class SmartyCancellationReason < ApplicationRecord
  enum winback: [:not_defined, :swap, :skip]
end
