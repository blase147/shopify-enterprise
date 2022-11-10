module Mutations
  class AddWaysToEarnPoints < Mutations::BaseMutation
    argument :params, Types::Input::FetchWaysToEarnPointInputType, required: true
    field :ways_to_earn_points, Types::WaysToEarnPointType, null: false

    def resolve(params:)
      params = Hash params

      begin
        if params[:id].present?
          ways_to_earn_points = WaysToEarnPoint.find(params[:id])
          ways_to_earn_points.update(params)
        else
          ways_to_earn_points = current_shop.ways_to_earn_points.create!(params)
        end
        { ways_to_earn_points: ways_to_earn_points }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
