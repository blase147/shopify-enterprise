module Types
  class CustomerModalType < Types::BaseObject
    field :email, String, null: false
    field :name, String, null: true
    field :shopify_id, String, null: true
    field :contracts,String, null: false

    def contracts
      "#{object&.contracts}"
    end

  end
end
