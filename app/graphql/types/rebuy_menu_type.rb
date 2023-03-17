module Types
  class RebuyMenuType < Types::BaseObject
    field :id, ID, null: false
    field :interval_type, String, null: true
    field :interval_count, String, null: true
    field :status, String, null: true
    field :product_images, [Types::ProductType], null: true
    field :collection_images, [Types::CollectionType], null: true
    field :rebuy_type, String, null: true
    
    field :rebuy_offers_generated, Int, null: true
    field :rebuy_offers_conversion, Int, null: true
    field :created_at, String, null: true
    field :updated_at, String, null: true

    def created_at
      object.created_at&.strftime('%b %d %Y, %I:%M %p')
    end

    def updated_at
      object. updated_at&.strftime('%b %d %Y, %I:%M %p')
    end

    def rebuy_offers_generated
      object.rebuys&.count
    end

    def rebuy_offers_conversion
      object.rebuys.count
    end

    def rebuy_type
      RebuyMenu.rebuy_types[object.rebuy_type]
    end
  end
end
