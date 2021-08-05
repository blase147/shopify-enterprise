namespace :orders do
  task :sync_orders => :environment do
    puts "Cron for sync orders: at #{Time.current}"
    Shop.find_each do |shop|
      shop.connect
      ShipEngineService::SyncOrders.new(shop).sync
    end
  end
end
