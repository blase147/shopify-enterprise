module Types
    module Input
      class SubscriptionProductInputType < Types::BaseInputObject
        argument :id, ID,required: false
        argument :status, String, required: false
        argument :selling_plan, [Types::Input::RuleCustomerValueInputType], required: false
        argument :product_images, [Types::Input::ProductInputType], required: false
        argument :membership_type, String, required: false
      end
    end
end