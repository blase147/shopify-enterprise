module Types
  class SingleOrderType < Types::BaseObject
    field :id, ID, null: true
    field :title, String, null: true
    field :image, String, null: true
    field :description, String, null: true

    def id
      object["product_id"]
    end

    def title
      object["title"]
    end

    def image
      object["image"]
    end

    def description
      object["description"]
    end
  end
end