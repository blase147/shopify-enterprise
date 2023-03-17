module Queries
    class FetchRebuyMenu < Queries::BaseQuery
      
      argument :id, ID, required: true
      type Types::RebuyMenuType, null: false

      def resolve(id:)
        current_shop.rebuy_menus.find(id)
      end
    end
end