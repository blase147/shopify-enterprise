class SubscriptionDraftsService < GraphqlService
  UPDATE_QUERY = <<-GRAPHQL
    mutation($draftId: ID!, $input: SubscriptionDraftInput!) {
      subscriptionDraftUpdate(draftId: $draftId, input: $input) {
        draft {
          id
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  GRAPHQL

  ADD_QUERY = <<-GRAPHQL
    mutation($draftId: ID!, $input: SubscriptionLineInput!) {
      subscriptionDraftLineAdd(draftId: $draftId, input: $input) {
        draft {
          id
        }
        lineAdded {
          id
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  GRAPHQL

  LINE_UPDATE = <<-GRAPHQL
    mutation($draftId: ID!, $lineId: ID!, $input: SubscriptionLineUpdateInput!) {
      subscriptionDraftLineUpdate(draftId: $draftId, lineId: $lineId, input: $input) {
        draft {
          id
        }
        lineUpdated {
          id
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  GRAPHQL

  LINE_REMOVE = <<-GRAPHQL
    mutation($draftId: ID!, $lineId: ID!) {
      subscriptionDraftLineRemove(draftId: $draftId, lineId: $lineId) {
        discountsUpdated {
          id
        }
        draft {
          id
        }
        lineRemoved {
          id
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  GRAPHQL

  COMMIT_QUERY = <<-GRAPHQL
    mutation($draftId: ID!) {
      subscriptionDraftCommit(draftId: $draftId) {
        contract {
          id
          status
          createdAt
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  GRAPHQL

  APPLY_DISCOUNT = <<-GRAPHQL
    mutation subscriptionDraftDiscountCodeApply($draftId: ID!, $redeemCode: String!) {
      subscriptionDraftDiscountCodeApply(draftId: $draftId, redeemCode: $redeemCode) {
        appliedDiscount {
          id
        }
        draft {
          id
        }
        userErrors {
          code
          field
          message
        }
      }
    }
  GRAPHQL

  def update id, input={}
    result = client.query(client.parse(UPDATE_QUERY), variables: { draftId: id, input: input } )
    errors = result.data.subscription_draft_update.user_errors
    raise errors.first.message if errors.present?
    result.original_hash
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def line_update id, line_id, input={}
    result = client.query(client.parse(LINE_UPDATE), variables: { draftId: id, lineId: line_id, input: input } )
    p result
    errors = result.data.subscription_draft_line_update.user_errors

    raise errors.first.message if errors.present?
    result.original_hash
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def add_line(draft_id, input={})
    result = client.query(client.parse(ADD_QUERY), variables: { draftId: draft_id, input: input })
    errors = result.data.subscription_draft_line_add.user_errors
    raise errors.first.message if errors.present?
    result.original_hash
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def remove(draft_id, line_id)
    result = client.query(client.parse(LINE_REMOVE), variables: { draftId: draft_id, lineId: line_id } )

    errors = result.data.subscription_draft_line_remove.user_errors
    raise errors.first.message if errors.present?
    result.original_hash
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def commit id
    result = client.query(client.parse(COMMIT_QUERY), variables: { draftId: id } )
    p result

    errors = result.data.subscription_draft_commit.user_errors
    raise errors.first.message if errors.present?
    result.original_hash
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end

  def apply_discount(draft_id, redeem_code)
    result = client.query(client.parse(APPLY_DISCOUNT), variables: { draftId: id, redeem_code: redeem_code} )
    errors = result.data.subscription_draft_update.user_errors
    raise errors.first.message if errors.present?
    result.original_hash
  rescue Exception => ex
    p ex.message
    { error: ex.message }
  end
end
