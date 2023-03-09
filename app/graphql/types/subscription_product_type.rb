module Types
      class SubscriptionProductType < Types::BaseObject
        field :id, ID, null: false
        field :status, String, null: false
        field :selling_plan, [Types::Input::RuleCustomerValueInputType], null: false
        field :product_images, [Types::Input::ProductInputType], null: false
        field :membership_type, String, null: false
      end
end