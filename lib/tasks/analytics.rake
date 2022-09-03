namespace :analytics do
  task :update_analytics => :environment do
    Shop.find_each do |shop|
      UpdateAnalyticsCacheService.new.call(shop)
    end
  end
end
