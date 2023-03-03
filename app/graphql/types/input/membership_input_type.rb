module Types
    module Input
      class MembershipInputType < Types::BaseInputObject
        argument :id, ID,required: false
        argument :name, String, required: false
        argument :status, String, required: false
        argument :tag, String, required: false
        argument :selling_plan_id, [Types::Input::RuleCustomerValueInputType], required: false
      end
    end
end