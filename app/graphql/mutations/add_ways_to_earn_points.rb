module Mutations
  class AddWaysToEarnPoints < Mutations::BaseMutation
    argument :params, Types::Input::FetchWaysToEarnPointInputType, required: true
    field :ways_to_earn_points, Types::FetchWaysToEarnPointType, null: false

    def resolve(params:)
      params = Hash params

      begin
        ways_to_earn_points = current_shop.ways_to_earn_points.create!(params)
        { ways_to_earn_points: ways_to_earn_points }
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end
