class Rebuy < ApplicationRecord
  belongs_to :shop
  belongs_to :customer_modal
  belongs_to :rebuy_menu

  enum :status=>{"open": "open", "filled": "filled", "completed": "completed"}
end
