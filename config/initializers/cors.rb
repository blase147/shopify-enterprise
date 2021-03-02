# config/initializers/cors.rb

Rails.application.config.middleware.insert_before(0, Rack::Cors) do
  allow do
    origins '*' # allow access to this api from any domain
    resource '*', # allow all origins access to all resources
      headers: ['authorization', 'content-type', 'context'], # restrict headers to relevant keys
      methods: [:post, :get, :options] # restrict the methods to only the ones expected to be used by the extension
  end
end

Rails.application.config.action_controller.forgery_protection_origin_check = false