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

        defaultAddress {
          id
          formatted
          address1
          address2
        }
      }
    }
  GRAPHQL

  def initialize params
    @shop = params[:shop]
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
    db_customer = Customer.find_or_initialize_by(shopify_id: info[:id])
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
    db_customer = Customer.find_or_initialize_by(shopify_id: id)
    db_customer.first_name = customer.first_name
    db_customer.last_name = customer.last_name
    db_customer.email = customer.email
    db_customer.phone = customer.phone
    db_customer.address_1 = customer.default_address.try(:address1)
    db_customer.address_2 =  customer.default_address.try(:address2)
    db_customer.shop_id = @shop.id
    db_customer.save

    db_customer
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end