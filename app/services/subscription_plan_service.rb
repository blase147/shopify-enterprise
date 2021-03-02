class SubscriptionPlanService < GraphqlService
  attr_accessor :plan_group

  LIST_QUERY = <<-GRAPHQL
    {
      sellingPlanGroups(first: 10 reverse: true) {
         edges {
           node {
             id
             appId
             name
             merchantCode
             options
             description
             sellingPlans(first: 10){
              edges{
                node{
                  id
                  name
                  options
                  position
                  billingPolicy {
                    ... on SellingPlanRecurringBillingPolicy {
                      interval
                      intervalCount
                    }
                  }
                  deliveryPolicy {
                    ... on SellingPlanRecurringDeliveryPolicy {
                      interval
                      intervalCount
                    }
                  }
                  pricingPolicies {
                    ... on SellingPlanFixedPricingPolicy {
                      adjustmentType
                      adjustmentValue {
                        ... on MoneyV2 {
                          amount
                        }

                        ... on SellingPlanPricingPolicyPercentageValue {
                          percentage
                        }
                      }
                    }
                    ... on SellingPlanRecurringPricingPolicy {
                      adjustmentType
                      adjustmentValue
                    }
                  }
                }
              }
             }
           }
         }
        }
      }
  GRAPHQL

  DELETE_QUERY = <<-GRAPHQL
    mutation($id: ID!) {
      sellingPlanGroupDelete(id: $id) {
        deletedSellingPlanGroupId
        userErrors {
          code
          field
          message
        }
      }
    }
  GRAPHQL

  def initialize plan_group=nil
    @plan_group = plan_group
  end

  def plans
    result = client.query(client.parse(LIST_QUERY))
  end

  def list
    # result = client.query(client.parse(LIST_QUERY))
    
    items = SellingPlanGroup.all.map do |group|
      { 
        id: group.id,
        name: group.public_name,
        billing: group.plan_selector_title
      }
    end

    items
  end

  def delete(id)
    # id = plan_group.shopify_id
    result = client.query(client.parse(DELETE_QUERY), variables: { id: id})
  end

end