class PowerPlanSwapWorker
  include Sidekiq::Worker

  def perform(shop_id, selling_plan_id, original_product_id, variant_id)
    shop = Shop.find(shop_id)
    shop.connect
    selling_plan = SellingPlan.find(selling_plan_id)
    PowerPlanSwapService.new(selling_plan.shopify_id).run(original_product_id, variant_id)
  end
end
