class CreateWebhook < GraphqlService
	CREATE_QUERY = <<-GRAPHQL
    mutation ($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
      webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
        webhookSubscription {
          id
          topic
          format
          endpoint {
            __typename
            ... on WebhookHttpEndpoint {
              callbackUrl
            }
          }
        }
      }
    }
  GRAPHQL

  def run(shop_id, topic, url)
    Shop.find(shop_id).connect
    result = client.query(client.parse(CREATE_QUERY), variables: { topic: topic, webhookSubscription: {callbackUrl: url}} )
    p result.data.to_json
  end
end
