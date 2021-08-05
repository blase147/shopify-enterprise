class ShipEngineOrder < ApplicationRecord
  belongs_to :shop
  enum status: %i[processing shipped delivered]
end
