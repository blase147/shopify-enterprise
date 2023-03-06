module Types
    module Input
      class MembershipInputType < Types::BaseInputObject
        argument :id, ID,required: false
        argument :name, String, required: false
        argument :status, String, required: false
        argument :tag, String, required: false
        argument :selling_plan, [Types::Input::RuleCustomerValueInputType], required: false
        argument :variant_images, [Types::Input::VariantInputType], required: false
        argument :product_images, [Types::Input::ProductInputType], required: false
        argument :membership_type, String, required: false
      end
    end
end