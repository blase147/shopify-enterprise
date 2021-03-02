module Queries
  class BaseQuery < GraphQL::Schema::Resolver
    def current_shop
      context[:current_shop]
    end
  end
end