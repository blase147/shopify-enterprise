class Membership < ApplicationRecord
    belongs_to :shop
    belongs_to :selling_plan, optional: true
end