module Queries
  class FetchTranslation < Queries::BaseQuery
    type Types::TranslationType, null: false

    def resolve
      Translation.find_or_create_by(shop_id: current_shop.id)
    end
  end
end
