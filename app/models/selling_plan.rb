class SellingPlan < ApplicationRecord
  belongs_to :selling_plan_group
  validates_presence_of :name, :selector_label
  enum box_subscription_type: %i[undefined collection products]

  attr_accessor :total_amount, :active_subscriptions, :orders

  after_save_commit :check_multiple_anchors
  has_one :membership
  has_many :subscription_products

  def check_multiple_anchors
    if billing_dates && billing_dates.size > 1
      today = Date.today
      billing_dates.each_with_index do |date, i|
        # No need for first date
        if i > 0
          parsed_date = DateTime.parse(date)
          if parsed_date > today
            args = [selling_plan_group_id, date]
            unless Sidekiq::ScheduledSet.new.find{|j| j.args == args}
              SellingPlanAnchorUpdateWorker.perform_at(parsed_date - 2.days, *args)
            end
          end
        end
      end
    end
  end
end
