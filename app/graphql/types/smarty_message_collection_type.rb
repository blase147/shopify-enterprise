module Types
  class SmartyMessageCollectionType < Types::BaseObject
    field :total_count, Integer, null: true
    field :smarty_messages, [Types::SmartyMessageType], null: true
  end
end
