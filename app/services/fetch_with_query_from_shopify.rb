class FetchWithQueryFromShopify < GraphqlService
    GET_CUSTOMERS = <<-GRAPHQL
        query($query: String!) {
        customers(first: 10, query: $query) {
            edges {
                node {
                    id
                    email
                    firstName
                }
            }
        }
        }
    GRAPHQL
    
    GET_SELLINGPLAN = <<-GRAPHQL
        query($id: ID!) {
            sellingPlanGroup(id: $id) {
                 sellingPlans(first: 10) {
                    edges {
                        node {
                            id
                            name
                            options
                            billingPolicy{
                                ... on SellingPlanRecurringBillingPolicy{
                                    anchors{
                                        day
                                        month
                                        type
                                    }
                                    interval
                                    intervalCount
                                }
                            }
                            deliveryPolicy{
                                ... on SellingPlanRecurringDeliveryPolicy{
                                    anchors{
                                        day
                                        month
                                        type
                                    }
                                    interval
                                    intervalCount
                                }
                            }
                        }
                    }
                }
              }
        }
    GRAPHQL

    def fetch_customers(query)
        result = client.query(client.parse(GET_CUSTOMERS), variables: { query: query })
        errors = result.data.customers.errors
        raise errors.first.message if errors.present?
        @customers = result.data.customers.edges
        return @customers 
    rescue Exception => ex
        p ex.message
        { error: ex.message }
    end

    def fetch_sellingplans(id)
        result = client.query(client.parse(GET_SELLINGPLAN), variables: { id: id })
        errors = result.data.selling_plan_group.errors
        raise errors.first.message if errors.present?
        @selling_plan = result.data.selling_plan_group.selling_plans.edges.first.node
        return @selling_plan 
    rescue Exception => ex
        p ex.message
        { error: ex.message }
    end
end