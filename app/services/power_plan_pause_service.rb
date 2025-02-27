class PowerPlanPauseService

  def initialize(selling_plan_id)
    @selling_plan_id = selling_plan_id
  end

  def run(status)
    all_subscriptions = SubscriptionContractsPowerService.new.all_subscriptions

    all_subscriptions[:subscriptions].each do |subscription|
      if subscription.node.status == 'ACTIVE'
        subscription.node.lines.edges.each do |line|
          if line.node.selling_plan_id == @selling_plan_id
            # if subscription.node.lines.edges.count > 1
            #   draft_id = SubscriptionContractUpdateService.new(subscription.node.id).get_draft({})[:draft_id]
            #   result = SubscriptionDraftsService.new.remove(draft_id, line.node.id)
            #   if result[:error].present?
            #     puts "Error power plan pause service: #{result[:error]}"
            #   else
            #     SubscriptionDraftsService.new.commit draft_id
            #   end
            # else
              SubscriptionContractDeleteService.new(subscription.node.id).run(status)
              break
            # end
          end
        end
      end
    end
  end
end
