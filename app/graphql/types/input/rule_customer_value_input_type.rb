module Types
    module Input
      class RuleCustomerValueInputType < Types::BaseInputObject
        argument :sellingPlanId, String, required: true
        argument :sellingPlanName, String, required: false

        argument :__typename, String, required: false
      end
    end
  end