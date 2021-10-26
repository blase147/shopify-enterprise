module Queries
  class FetchPowerPlanGroup < Queries::BaseQuery
    type Types::SellingPlanGroupType, null: false
    argument :id, ID, required: true

    def resolve(id:)
      selling_plan_group = if id.include?('gid://shopify')
        current_shop.selling_plan_groups.find_by_shopify_id(id)
      else
        current_shop.selling_plan_groups.find(id)
      end

      result = SubscriptionContractsPowerService.new.all_subscriptions

      selling_plan_group.selling_plans.each do |sp|
        filtered = result[:subscriptions].select do |s|
          s.node.lines.edges.map{|e| e.node.selling_plan_id }.include?(sp.shopify_id)
        end

        total_amounts = filtered.map do |s|
          s.node.orders.edges.map do |o|
            o.node.total_received_set.presentment_money.amount.to_f
          end
        end.flatten

        sp.active_subscriptions = total_amounts.size
        sp.total_amount = total_amounts.reduce(:+)
        sp.orders = filtered.map{|s| s.node.orders.edges.map{|o| {
          id: o.node.id,
          name: o.node.name,
          customer: o.node.customer.display_name,
          displayFulfillmentStatus: o.node.display_fulfillment_status,
          amount: o.node.total_received_set.presentment_money.amount,
          dateCreated: o.node.created_at
        }}}.flatten
      end

      selling_plan_group
    end
  end
end
