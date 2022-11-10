module Types
  module Input
    class FetchWaysToEarnPointInputType < Types::BaseInputObject
      argument :points_awarded, String,required: false
      argument :title, String, required: true
      argument :id, ID, required: false
      argument :status, Boolean, required: false
      argument :summary, String, required: false
    end
  end
end
  