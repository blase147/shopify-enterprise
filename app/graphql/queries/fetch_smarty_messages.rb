module Queries
  class FetchSmartyMessages < Queries::BaseQuery
    type [Types::SmartyMessageType], null: false
    argument :search_key, String, required: false
    argument :sort_column, String, required: false
    argument :sort_direction, String, required: false
    argument :custom, String, required: false

    def resolve(**args)
      current_shop.smarty_messages.where(where_data(args)).order(order_by(args))
    end

    def order_by(params)
      params[:sort_column].present? && params[:sort_direction].present? ? "#{params[:sort_column]} #{params[:sort_direction]}" : 'created_at DESC'
    end

    def where_data(args)
      where = ''
      where += "title ILIKE '%#{args[:search_key]}%'" if args[:search_key].present?
      where += "custom = '#{args[:custom]}'" if args[:custom].present?
    end
  end
end
