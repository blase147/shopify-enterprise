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

  GET_BILLING_CYCLE    = <<-GRAPHQL
    mutation($contractId: ID!, $index: Int) {
      subscriptionBillingCycleContractEdit(billingCycleInput: {
        contractId: $contractId,
        selector: { index: $index }
      }){
        draft {
          id
          lines(first:10) {
            edges {
              node {
                id
              }
            }
          }
          billingCycle {
            cycleIndex
            cycleStartAt
            cycleEndAt
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  GRAPHQL

  REMOVE_LINE_ITEM    = <<-GRAPHQL
    mutation($draftId: ID!, $lineId: ID!) {
      subscriptionDraftLineRemove(
        draftId: $draftId
        lineId: $lineId
      ) {
        draft {
          id
        }
        lineRemoved {
          id
        }
        userErrors {
          field
          message
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
    @data = data["data"] rescue nil
    @customer_id = data["customer_id"] rescue nil
    @selling_plan = FetchWithQueryFromShopify.new.fetch_sellingplans(data["sellingplangroup"], data["sellingplan"]) rescue nil
    @payment_id = data["data"]["payment_method_id"] rescue nil
    @variant_id = data["variant_id"] rescue nil
  end

  def fetch_customer
    result = client.query(client.parse(CUSTOMER_QUERY), variables: { id: @customer_id })
    sleep CalculateShopifyWaitTime.calculate_wait_time(result&.extensions["cost"]) if result&.extensions.present?
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
    billing_policy = [{ day: @selling_plan&.billing_policy&.anchors&.first&.day, type: @selling_plan.billing_policy.anchors.first.type }] rescue []
    delivery_policy = [{ day: @selling_plan&.delivery_policy&.anchors&.first&.day, type: @selling_plan.delivery_policy.anchors.first.type }] rescue []
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
          anchors: billing_policy
        },
        deliveryPolicy: {
              interval: @selling_plan.delivery_policy.interval,
              intervalCount:  @selling_plan.delivery_policy.interval_count,
          anchors: delivery_policy
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
    p @customer_id
    result = client.query(client.parse(CREATE_QUERY), variables: { input: input })
    sleep CalculateShopifyWaitTime.calculate_wait_time(result&.extensions["cost"]) if result&.extensions.present?
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
    sleep CalculateShopifyWaitTime.calculate_wait_time(result&.extensions["cost"]) if result&.extensions.present?
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
    sleep CalculateShopifyWaitTime.calculate_wait_time(result&.extensions["cost"]) if result&.extensions.present?
    @contract_id = result.data.subscription_draft_commit.contract.id
    errors = result.data.subscription_draft_commit.user_errors
    raise errors.first.message if errors.present?

    return @contract_id
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def get_draft_billing_cycle id, billing_index
    id = if id.is_a?(String) && id.include?('SubscriptionContract')
      id
    else
      "gid://shopify/SubscriptionContract/#{id}"
    end
    result = client.query(client.parse(GET_BILLING_CYCLE), variables: { contractId: id, index: billing_index} )
    sleep CalculateShopifyWaitTime.calculate_wait_time(result&.extensions["cost"]) if result&.extensions.present?
    errors = result.data.subscription_draft_line_add.user_errors
    raise errors.first.message if errors.present?

    draft_id = result.data.subscription_billing_cycle_contract_edit.draft.id
    first_line_item_id = result.data.subscription_billing_cycle_contract_edit.draft.lines.edges.first.node.id

    #remove Line item
    remove_line(draft_id, first_line_item_id)

    #AddLineItem
    variant = ShopifyAPI::Variant.find(@variant_id)
    result = add_line_product(draft_id, @variant_id, 1, variant.price)



  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def remove_line draft_id, first_line_item_id
    result = client.query(client.parse(REMOVE_LINE_ITEM), variables: { draftId: draft_id, lineId: first_line_item_id} )
    sleep CalculateShopifyWaitTime.calculate_wait_time(result&.extensions["cost"]) if result&.extensions.present?
    errors = result.data.subscription_draft_line_remove.user_errors
    raise errors.first.message if errors.present?
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def add_line_product draft_id, variant_id, quantity, price
    input = {
      productVariantId: "gid://shopify/ProductVariant/#{variant_id}",
      quantity: quantity.to_i,
      currentPrice: price.to_f,
    }
    result = client.query(client.parse(ADD_LINE_QUERY), variables: { input: input , id: draft_id})
    sleep CalculateShopifyWaitTime.calculate_wait_time(result&.extensions["cost"]) if result&.extensions.present?
    errors = result.data.subscription_draft_line_add.user_errors
    raise errors.first.message if errors.present?

    @draft_line_add_id = result.data.subscription_draft_line_add.line_added.id

    complete unless @draft_line_add_id.nil?
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

end