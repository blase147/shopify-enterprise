module Types
  class OrderProductType < Types::BaseObject
    field :id, String, null: true
    field :image_url, String, null: true

    def id
      object.id
    end

    def image_url
      object.images.first.src
    end
  end
end
