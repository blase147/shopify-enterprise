module Queries
  class FetchThemes < Queries::BaseQuery

    type [Types::ThemeType], null: false

    def resolve
      ShopifyAPI::Theme.all
    end
  end
end