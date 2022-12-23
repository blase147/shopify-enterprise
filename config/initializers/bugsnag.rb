if ENV['RAILS_ENV'] == "production"
  Bugsnag.configure do |config|
    config.api_key = "742cc1daa6d09c103e61664db3c5dd90"
  end
end
