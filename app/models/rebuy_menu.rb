class RebuyMenu < ApplicationRecord
    belongs_to :shop
    has_many :rebuys, dependent: :destroy
    enum :status=>{"Active": "active", "Inactive": "inactive"}
    enum :rebuy_type=>{"Auto( 5 most popular variant ids)": "auto", "All products ": "all_products", "Collection": "collection", "Product": "product"}
end
