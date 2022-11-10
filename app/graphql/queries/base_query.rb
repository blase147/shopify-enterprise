module Queries
  class BaseQuery < GraphQL::Schema::Resolver
    def current_shop
      context[:current_shop]
    end
    def current_user
      context[:current_user]
    end
  end
end