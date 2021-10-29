class PowerPlanSwapService

  def initialize(selling_plan_id)
    @selling_plan_id = selling_plan_id
  end

  def run(original_product_id, variant_id)
    variant = ShopifyAPI::Variant.find(variant_id[/\d+/])
    all_subscriptions = SubscriptionContractsPowerService.new.all_subscriptions

    all_subscriptions[:subscriptions].each do |subscription|
      if subscription.node.status == 'ACTIVE'
        subscription.node.lines.edges.each do |line|
          if line.node.selling_plan_id == @selling_plan_id && line.node.product_id == original_product_id
            draft_id = SubscriptionContractUpdateService.new(subscription.node.id).get_draft({})[:draft_id]
            result = SubscriptionDraftsService.new.line_update draft_id, line.node.id, { 'productVariantId': variant_id, 'quantity': 1, 'currentPrice': variant.price }
            SubscriptionDraftsService.new.commit draft_id
          end
        end
      end
    end
  end
end
