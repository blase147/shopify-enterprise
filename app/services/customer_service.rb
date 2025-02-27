class CustomerService < GraphqlService
  UPDATE_QUERY = <<-GRAPHQL
    mutation($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  GRAPHQL

  GET_QUERY = <<-GRAPHQL
    query($id: ID!){
      customer(id: $id) {
        id
        displayName
        firstName
        lastName
        email
        phone
        paymentMethods(first: 10) {
          edges {
            node {
              id
              instrument {
                ... on CustomerCreditCard {
                  billingAddress {
                    address1
                    city
                    country
                    province
                    zip
                  }
                  expiryMonth
                  expiryYear
                  expiresSoon
                  lastDigits
                  name
                  brand
                }
                ... on CustomerShopPayAgreement {
                  lastDigits
                  expiryMonth
                  expiryYear
                  expiresSoon
                  inactive
                  isRevocable
                  lastDigits
                  maskedNumber
                  name  
                }
              }
            }
          }
        }
        defaultAddress {
          id
          formatted
          address1
          address2
          city
          country
          province
          zip
        }
      }
    }
  GRAPHQL

  CUSTOMER_PAYMENT_CREATE = <<-GRAPHQL
    mutation($customerId: ID!, $remoteReference: CustomerPaymentMethodRemoteInput!) {
      customerPaymentMethodRemoteCreate(
        customerId: $customerId,
        remoteReference: $remoteReference
      ) {
        customerPaymentMethod {
          id
          instrument {
            ... on CustomerCreditCard {
              brand
              lastDigits
            }
          }
        }
      }
    }
  GRAPHQL

  GET_CUSTOMER_BY_EMAIL  = <<-GRAPHQL
    query($email: String) {
      customers(first: 1, query:$email){
        edges{
          node {
            email
            id
            firstName
            lastName
          }
        }
      }
    }
  GRAPHQL

  def initialize params
    @shop = params[:shop]
  end

  def get_customer(customer_id)
    id = "gid://shopify/Customer/#{customer_id}"
    result = client.query(client.parse(GET_QUERY), variables: { id: id} )
    sleep CalculateShopifyWaitTime.calculate_wait_time(result&.extensions["cost"]) if result&.extensions.present?
    result.data.customer
  end

  def get_customer_email(email)
    email = "email:'#{email}'"
    result = client.query(client.parse(GET_CUSTOMER_BY_EMAIL), variables: { email: email} )
    sleep CalculateShopifyWaitTime.calculate_wait_time(result&.extensions["cost"]) if result&.extensions.present?
    return result&.data&.customers&.edges&.first&.node
  end

  def update info
    customer_params = {
      id: info[:id]
    }
    customer_params[:firstName] = info[:first_name] if info.key?(:first_name)
    customer_params[:lastName] = info[:last_name] if info.key?(:last_name)
    customer_params[:email] = info[:email] if info.key?(:email)
    customer_params[:phone] = info[:phone] if info.key?(:phone)
    customer_params[:addresses] = {} if info.key?(:address_1) || info.key?(:address_2)
    customer_params[:addresses][:address1] = info[:address_1] if info.key?(:address_1)
    customer_params[:addresses][:address2] = info[:address_2] if info.key?(:address_2)

    result = client.query(client.parse(UPDATE_QUERY), variables: { input: customer_params })
    errors = result.data.customer_update.user_errors
    raise errors.first.message if errors.present?
    db_customer = CustomerSubscriptionContract.find_or_initialize_by(shopify_id: info[:id])
    db_params = info.permit(:first_name,
                            :last_name,
                            :email,
                            :phone,
                            :address_1,
                            :address_2,
                            :gender,
                            :communication,
                            :birthday)
    db_customer.avatar = info[:avatar]
    db_customer.assign_attributes(db_params)
    db_customer.save
    errors = db_customer.errors.full_messages
    raise errors if errors.present?
  rescue Exception => ex
    { error: ex.message }
  end

  def find(customer_id)
    id = "gid://shopify/Customer/#{customer_id}"

    result = client.query(client.parse(GET_QUERY), variables: { id: id} )
    customer = result.data.customer
    db_customer = CustomerSubscriptionContract.find_or_initialize_by(shopify_id: customer_id)
    db_customer.first_name = customer.first_name unless db_customer.first_name.present?
    db_customer.last_name = customer.last_name unless db_customer.last_name.present?
    db_customer.email = customer.email unless db_customer.email.present?
    db_customer.phone = customer.phone unless db_customer.phone.present?
    db_customer.address_1 = customer.default_address.try(:address1)
    db_customer.address_2 =  customer.default_address.try(:address2)
    db_customer.shop_id = @shop.id
    db_customer.save

    db_customer
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def update_address params
    if params[:address].is_a?(Hash)
      address_attr = params[:address].deep_transform_keys { |key| key.to_s.camelize(:lower) }
    else
      address_attr = params[:address].permit!.to_h.deep_transform_keys { |key| key.camelize(:lower) }
    end
    db_customers = CustomerSubscriptionContract.where(shopify_customer_id: params[:id][/\d+/])
    result = client.query(client.parse(UPDATE_QUERY), variables: { input: {id: "gid://shopify/Customer/#{params[:id]}", "addresses": address_attr} })
    errors = result.data.customer_update.user_errors
    raise errors.first.message if errors.present?
    db_params = params[:address].is_a?(Hash) ? params[:address] : params[:address].permit!
    db_customers.each do |customer|
      customer.shop_id = @shop.id
      customer.assign_attributes(db_params)
      customer.save
      errors = customer.errors.full_messages
      raise errors if errors.present?
    end
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def create_customer_payment_remote_method(stripe_customer_id, shopify_customer_id)
    result = client.query(client.parse(CUSTOMER_PAYMENT_CREATE), variables: { customerId: shopify_customer_id, remoteReference: { stripePaymentMethod:{customerId: stripe_customer_id}}} )
    p result.to_json
  end

  def add_tag_to_customer(customer_id , tag)
    customer = ShopifyAPI::Customer.find(customer_id)
    tags = customer.tags.split(",")
    tags << tag
    customer.tags = tags&.uniq&.join(",")
    customer.save
  end 

  def remove_tag_to_customer(customer_id , tag)
    customer = ShopifyAPI::Customer.find(customer_id)
    tags = customer.tags.split(",")
    tags.delete(tag)
    customer.tags = tags.join(",")
    customer.save
  end 

  def check_order_for_associated_membership order_id
    order = ShopifyAPI::Order.find(order_id)
    if order.present?
      membership_tags = []
      order&.line_items&.each do |line_item| 
          tags = Membership.where("variant_images @> ?", '[{"variant_id": "gid://shopify/ProductVariant/'+"#{line_item.variant_id}"+'"}]').pluck(:tag) rescue nil
          membership_tags << tags if tags.present?

          tags = Membership.where("product_images @> ?", '[{"product_id": "gid://shopify/Product/'+"#{line_item.product_id}"+'"}]').pluck(:tag) rescue nil

          membership_tags << tags if tags.present?        
      end 

      membership_tags = membership_tags.join(",").split(",")

      if membership_tags.present?
        customer = CustomerModal.find_by_shopify_id(order.customer.id)
        customer&.update(membership_tags: membership_tags)
        add_tag_to_customer(order.customer.id, membership_tags.join(","))
      end
    end
  end

end
