class OrderDraftService < GraphqlService
  CREATE_QUERY = <<-GRAPHQL
    mutation($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
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
      draftOrderComplete(id: $id) {
        draftOrder {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  GRAPHQL

  def create(input)
    result = client.query(client.parse(CREATE_QUERY), variables: { input: input })
    errors = result.data.draft_order_create.user_errors
    raise errors.first.message if errors.present?

    result.data.draft_order_create.draft_order
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def complete(draft_id)
    result = client.query(client.parse(COMPLETE_QUERY), variables: { id: draft_id, paymentPending: true })
    errors = result.data.draft_order_complete.user_errors
    raise errors.first.message if errors.present?

    result.data.draft_order_complete
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end
