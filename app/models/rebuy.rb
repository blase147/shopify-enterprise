class Rebuy < ApplicationRecord
  belongs_to :shop
  belongs_to :customer_modal
  belongs_to :rebuy_menu
end
