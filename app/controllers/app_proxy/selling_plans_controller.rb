class AppProxy::SellingPlansController < ApplicationController
  before_action :set_shop

  def plan_type
    return render json: { success: false } if ENV['APP_TYPE'] == 'private'

    @selling_plan = SellingPlan.joins(:selling_plan_group).where(selling_plan_groups: { shop_id: @shop.id }).find_by(shopify_id: "gid://shopify/SellingPlan/#{params[:selling_plan_id]}")
    if @selling_plan.present? && @selling_plan.box_subscription_type.present?
      render json: { success: true }
    else
      render json: { success: false }
    end
  end

  def set_shop
    @shop = Shop.find_by(shopify_domain: params[:shop])
  end
end
