class SubscriptionContractDraftService < GraphqlService
    CREATE_QUERY = <<-GRAPHQL
      mutation($input: SubscriptionContractCreateInput!) {
        subscriptionContractCreate(input: $input) {
          draft {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    GRAPHQL
  
    ADD_LINE_QUERY = <<-GRAPHQL
      mutation($id: ID!, $input: SubscriptionLineInput!) {
        subscriptionDraftLineAdd(
          draftId: $id
          input: $input
        ) {
          lineAdded {
            id
            quantity
            productId
            variantId
            variantImage {
              id
            }
            title
            variantTitle
            currentPrice {
              amount
              currencyCode
            }
            requiresShipping
            sku
            taxable
          }
          draft {
            id
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    GRAPHQL
  
    COMPLETE_QUERY = <<-GRAPHQL
      mutation($id: ID!) {
        subscriptionDraftCommit(draftId: $id) {
          contract {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    GRAPHQL
  
    CUSTOMER_QUERY = <<-GRAPHQL
      query($id: ID!) {
        customer(id: $id) {
          email
          firstName
          lastName
          defaultAddress {
            firstName
            lastName
            address1
            address2
            city
            provinceCode
            countryCode
            phone
            zip
          }
          paymentMethods(first: 5) {
            edges {
              cursor
              node {
                id
              }
            }
          }
        }
      }
    GRAPHQL
  
    def initialize(data)
      @data = data["data"]
      @customer_id = data["customer_id"]
      @selling_plan = FetchWithQueryFromShopify.new.fetch_sellingplans(data["sellingplangroup"], data["sellingplan"])
      @payment_id = data["data"]["payment_method_id"]
    end
  
    def fetch_customer
      result = client.query(client.parse(CUSTOMER_QUERY), variables: { id: @customer_id })
      errors = result.data.customer.errors
      raise errors.first.message if errors.present?
      
      @customer_address = result.data.customer.default_address.to_h
      unless @payment_id.present?
        if result.data.customer.payment_methods.edges.first.nil?
          raise "NO Payment Method Found"
        else
          @payment_id = result.data.customer.payment_methods.edges.first.node.id
        end
      end
      create 
    rescue Exception => ex
      p ex.message
      { error: ex.message }
    end
  
    def create
      input = {
        customerId: @customer_id,
        nextBillingDate: @data["next_billing_date"].to_date.strftime("%Y-%m-%d"),
        currencyCode: "USD",
        contract: {
          status: "ACTIVE",
          paymentMethodId: @payment_id,
          billingPolicy: {
            interval: @selling_plan.billing_policy.interval,
                intervalCount:  @selling_plan.billing_policy.interval_count,
            anchors: [{ day: @selling_plan&.billing_policy&.anchors&.first&.day, type: @selling_plan.billing_policy.anchors.first.type }]
          },
          deliveryPolicy: {
                interval: @selling_plan.delivery_policy.interval,
                intervalCount:  @selling_plan.delivery_policy.interval_count,
            anchors: [{ day: @selling_plan&.delivery_policy&.anchors&.first&.day, type: @selling_plan.delivery_policy.anchors.first.type }]
          },
          deliveryMethod: {
            shipping: {
              address: {
                firstName: @customer_address["firstName"],
                lastName: @customer_address["lastName"],
                address1: @customer_address["address1"],
                address2: @customer_address["address2"],
                city: @customer_address["city"],
                provinceCode: @customer_address["provinceCode"],
                countryCode: @customer_address["countryCode"],
                phone: @customer_address["phone"],
                zip: @customer_address["zip"],
              }
            }
          },
          deliveryPrice: @data["delivery_price"].to_f
        }
      }
      result = client.query(client.parse(CREATE_QUERY), variables: { input: input })
      errors = result.data.subscription_contract_create.user_errors
      raise errors.first.message if errors.present?
      @subscriptioncontract_id = result.data.subscription_contract_create.draft.id
      add_line
    rescue Exception => ex
      p ex.message
      { error: ex.message }
    end
  
  
    def add_line
      input = {
        productVariantId: "gid://shopify/ProductVariant/#{@data["variant_id"]}",
        quantity: @data["quantity"].to_i,
        currentPrice: @data["current_price"].to_f,
        sellingPlanId: @selling_plan.id,
        sellingPlanName: @selling_plan.name,
      }
      result = client.query(client.parse(ADD_LINE_QUERY), variables: { input: input , id: @subscriptioncontract_id})
      errors = result.data.subscription_draft_line_add.user_errors
      raise errors.first.message if errors.present?
  
      @draft_line_add_id = result.data.subscription_draft_line_add.line_added.id
  
      complete unless @draft_line_add_id.nil?
    rescue Exception => ex
      p ex.message
      { error: ex.message }
    end
  
    def complete
      result = client.query(client.parse(COMPLETE_QUERY), variables: { id: @subscriptioncontract_id })
      @contract_id = result.data.subscription_draft_commit.contract.id
      errors = result.data.subscription_draft_commit.user_errors
      raise errors.first.message if errors.present?
  
      return @contract_id
    rescue Exception => ex
      p ex.message
      { error: ex.message }
    end
  end