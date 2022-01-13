class PowerPlanPauseWorker
  include Sidekiq::Worker

  def perform(shop_id, selling_plan_id, status)
    shop = Shop.find(shop_id)
    shop.connect
    selling_plan = SellingPlan.find(selling_plan_id)
    PowerPlanPauseService.new(selling_plan.shopify_id).run(status)
  end
end
