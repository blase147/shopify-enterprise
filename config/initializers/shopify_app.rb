ShopifyApp.configure do |config|
  config.application_name = ENV["SHOPIFY_APP_NAME"]

  config.api_key = ENV['SHOPIFY_API_KEY']
  config.secret = ENV['SHOPIFY_API_SECRET']
  config.old_secret = ENV['SHOPIFY_OLD_SECRET']
  config.scope = ENV['SCOPES'] # "read_products" # Consult this page for more scope options:
                                 # https://help.shopify.com/en/api/getting-started/authentication/oauth/scopes
  config.embedded_app = true
  config.after_authenticate_job = false
  config.api_version = "2021-10"
  config.shop_session_repository = 'Shop'
  config.allow_jwt_authentication = true
  config.webhooks = [
    { topic: 'app/uninstalled', address: "#{ENV['HOST']}shopify_webhooks/app_uninstalled" },
    { topic: 'orders/create', address: "#{ENV['HOST']}shopify_webhooks/order_create", fields: ["id", "updated_at"]},
    { topic: 'orders/cancelled', address: "#{ENV['HOST']}shopify_webhooks/order_cancelled", fields: ["id"]},
    { topic: 'orders/fulfilled', address: "#{ENV['HOST']}shopify_webhooks/order_fulfilled", fields: ["id"]},
    { topic: 'orders/updated', address: "#{ENV['HOST']}shopify_webhooks/order_updated", fields: ["id", "financial_status", "updated_at"]},
    { topic: 'subscription_contracts/create', address: "#{ENV['HOST']}shopify_webhooks/subscription_contract_create", fields: ["id"]},
    { topic: 'subscription_contracts/update', address: "#{ENV['HOST']}shopify_webhooks/subscription_contract_update", fields: ["id"]},
    { topic: 'subscription_billing_attempts/success', address: "#{ENV['HOST']}shopify_webhooks/billing_attempt_success", fields: ["id"]}
  ]
end

# ShopifyApp::Utils.fetch_known_api_versions                        # Uncomment to fetch known api versions from shopify servers on boot
# ShopifyAPI::ApiVersion.version_lookup_mode = :raise_on_unknown    # Uncomment to raise an error if attempting to use an api version that was not previously known

#Monkey patch to make app proxy work
module ShopifyApp
  module AppProxyVerification
    private
    def query_string_valid?(query_string)
      query_hash = Rack::Utils.parse_query(query_string)

      signature = query_hash.delete('signature')
      return false if signature.nil?

      ActiveSupport::SecurityUtils.secure_compare(
        calculated_signature(query_hash, ShopifyApp.configuration.secret),
        signature
      ) || (ShopifyApp.configuration.old_secret.present? && ActiveSupport::SecurityUtils.secure_compare(
        calculated_signature(query_hash, ShopifyApp.configuration.old_secret),
        signature
      ))
    end

    def calculated_signature(query_hash_without_signature, secret)
      sorted_params = query_hash_without_signature.collect { |k, v| "#{k}=#{Array(v).join(',')}" }.sort.join

      OpenSSL::HMAC.hexdigest(
        OpenSSL::Digest.new('sha256'),
        secret,
        sorted_params
      )
    end
  end
end
