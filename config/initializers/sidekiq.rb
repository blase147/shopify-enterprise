if Rails.env.production?
  Sidekiq.configure_server do |config|
    config.redis = { host: "157.245.93.121", port: 6379 }
  end

  Sidekiq.configure_client do |config|
    config.redis = { host: "157.245.93.121", port: 6379 }
  end
end
