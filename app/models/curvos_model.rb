    class CurvosModel < ApplicationRecord
        belongs_to :customer_subscription_contract, optional: true
    end
