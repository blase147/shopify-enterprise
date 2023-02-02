module Queries
  class FetchSmartyMessage < Queries::BaseQuery
    argument :id, String, required: true
    type Types::SmartyMessageType, null: false

    def resolve(id:)
      current_shop.smarty_messages.find_by(id: id)
    end
  end
end
