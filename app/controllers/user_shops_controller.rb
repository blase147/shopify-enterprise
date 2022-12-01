class UserShopsController < ApplicationController
    skip_before_action :verify_authenticity_token, raise: false
    before_action :verify_user
    def authorize_user_shop
        redirect_to "/users/sign_in" unless current_user.present?
        user_shop_child = current_user&.user_shop_child
        shop_settings = user_shop_child&.user_shop_child_setting
        access_settings = { dashboard_access: user_shop_child.present? ? shop_settings&.dashboard_access : true,
                            manage_plan_access: user_shop_child.present? ? shop_settings&.manage_plan_access : true,
                            subscription_orders_access: user_shop_child.present? ? shop_settings&.subscription_orders_access : true, 
                            analytics_access: user_shop_child.present? ? shop_settings&.analytics_access : true, 
                            installation_access: user_shop_child.present? ? shop_settings&.installation_access : true, 
                            tiazen_access: user_shop_child.present? ? shop_settings&.tiazen_access : true, 
                            toolbox_access: user_shop_child.present? ? shop_settings&.toolbox_access : true, 
                            settings_access: user_shop_child.present? ? shop_settings&.settings_access : true,
                            ways_to_earn: user_shop_child.present? ? shop_settings&.ways_to_earn : true,
                            customer_modal: user_shop_child.present? ? shop_settings&.customer_modal : true }
        render json: {accessSettings: access_settings&.to_json}
    end

    def create_user_shop_child
        user_data=params[:user_data]
        settings=params[:settings]
        user = User.new(first_name: user_data[:firstName],last_name: user_data[:lastName],email: user_data[:email],password: user_data[:password],password_confirmation: user_data[:confirmPassword])
        error=nil
        if user.save
            user_shop_child = UserShopChild.new(user_id: user.id, user_shop_id: current_user.user_shop.id)
            if user_shop_child.save
                shop_id = Shop.find_by_shopify_domain(params[:shop_domain])&.id || current_user.user_shop.shops.first
                UserShopChildSetting.create(
                    shop_id: shop_id,
                    user_shop_child_id: user_shop_child.id,
                    dashboard_access: (settings.include?("dashboard_access") ? true : false),
                    manage_plan_access: (settings.include?("manage_plan_access") ? true : false),
                    subscription_orders_access: (settings.include?("subscription_orders_access") ? true : false),
                    analytics_access: (settings.include?("analytics_access") ? true : false),
                    installation_access: (settings.include?("installation_access") ? true : false),
                    tiazen_access: (settings.include?("tiazen_access") ? true : false),
                    toolbox_access: (settings.include?("toolbox_access") ? true : false),
                    settings_access: (settings.include?("settings_access") ? true : false),
                    ways_to_earn: (settings.include?("ways_to_earn") ? true : false),
                    customer_modal: (settings.include?("customer_modal") ? true : false)
                )
            else
                error = user_shop_child.errors.messages
            end
        else
            error = user.errors.messages
        end
        if error.present?
            render json:{error: error}
        else
            render json:{success: :ok}
        end
    end

    def verify_user
        redirect_to "/users/sign_in" unless current_user.present?
    end

    def change_shop
        session[:shop_domain]=params[:shop_domain]
        render json:{status: :ok}
    end 
end