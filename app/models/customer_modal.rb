class CustomerModal < ApplicationRecord
    validates :shopify_id, uniqueness: true, allow_nil: true
    validates :email, uniqueness: true
    belongs_to :shop
    has_one :auth_token, dependent: :destroy
    has_many :reward_codes, dependent: :destroy
    has_many :stripe_contracts, dependent: :destroy
    has_many :rebuys, dependent: :destroy
    
    def name
        self.first_name.to_s + " " + self.last_name.to_s
    end

    def get_token
        (self.auth_token.present? && (self.auth_token.updated_at + 30.minutes >= Time.current)) ? self.auth_token.token : nil 
    end
end
