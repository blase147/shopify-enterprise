module Types
  class SellingPlanOrderType < Types::BaseObject
    field :id, String, null: true
    field :displayFulfillmentStatus, String, null: true
    field :name, String, null: true
    field :customer, String, null: true
    field :amount, String, null: true
    field :createdAt, String, null: true
  end
end
