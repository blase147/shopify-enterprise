module Types
  class OriginOrderProductsType < Types::BaseObject
    field :id, String, null: true
    field :title, String, null: true
    field :image, String, null: true

    def id
      object["node"]["product"]["id"] rescue nil
    end

    def title
      object["node"]["product"]["title"] rescue nil
    end

    def image
      object["node"]["product"]["images"]["edges"].last["node"]["original_src"] rescue nil
    end
  end
end
