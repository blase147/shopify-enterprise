class SellingPlanAnchorUpdateWorker
  include Sidekiq::Worker

  def perform(selling_plan_group_id, anchor_date)
    selling_plan_group = SellingPlanGroup.find(selling_plan_group_id)
    selling_plan_group.shop.with_shopify_session do
      selling_plan_group.update_shopify_anchors(anchor_date)
    end
  end
end
