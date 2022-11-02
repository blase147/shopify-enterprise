class CustomerModal < ApplicationRecord
    validates :shopify_id, uniqueness: true
    validates :email, uniqueness: true
    belongs_to :shop
    def name
        self.first_name.to_s + " " + self.last_name.to_s
    end
end
