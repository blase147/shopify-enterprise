class UserShopsController < ApplicationController
    skip_before_action :verify_authenticity_token, raise: false
    before_action :verify_user
    def authorize_user_shop
        redirect_to "/users/sign_in" unless current_user.present?
        shop_id = Shop.find_by_shopify_domain(params[:shopify_domain]).id
        user_shop = current_user.user_shops.find_by_shop_id(shop_id)
        settings = user_shop&.access_settings
        access_settings = { dashboard_access: user_shop.role == "staff" ? settings["dashboard_access"].present? ? settings["dashboard_access"] : false  : true,
                            manage_plan_access: user_shop.role == "staff" ? settings["manage_plan_access"].present? ? settings["manage_plan_access"] : false : true,
                            subscription_orders_access: user_shop.role == "staff" ? settings["subscription_orders_access"].present? ? settings["subscription_orders_access"] : false : true, 
                            analytics_access: user_shop.role == "staff" ? settings["analytics_access"].present? ? settings["analytics_access"] : false : true, 
                            installation_access: user_shop.role == "staff" ? settings["installation_access"].present? ? settings["installation_access"] : false : true, 
                            tiazen_access: user_shop.role == "staff" ? settings["tiazen_access"].present? ? settings["tiazen_access"] : false : true, 
                            toolbox_access: user_shop.role == "staff" ? settings["toolbox_access"].present? ? settings["toolbox_access"] : false : true, 
                            settings_access: user_shop.role == "staff" ? settings["settings_access"].present? ? settings["settings_access"] : false : true,
                            ways_to_earn: user_shop.role == "staff" ? settings["ways_to_earn"].present? ? settings["ways_to_earn"] : false : true,
                            customer_modal: user_shop.role == "staff" ? (settings["customer_modal"].present? ? settings["customer_modal"] : false) : true,
                            manage_staff: user_shop.role == "staff" ? (settings["manage_staff"].present? ? settings["manage_staff"] : false) : true }
        render json: {accessSettings: access_settings&.to_json}
    end

    def create_user_shop_child
        user_data=params[:user_data]
        settings=params[:settings]
        user = User.find_by_email(user_data[:email]&.strip&.downcase) 
        if user.nil?
            user = User.new(first_name: user_data[:firstName],last_name: user_data[:lastName],email: user_data[:email]&.downcase,password: user_data[:password],password_confirmation: user_data[:confirmPassword])
            user.save
        end
        error=nil
        unless user&.errors&.messages.present?
            user_shop = UserShop.find_or_initialize_by(user_id: user.id, shop_id: current_shop(params[:shopify_domain]).id)
            user_shop.update( role: "staff")
            if user_shop.save
                user_shop.update(
                    access_settings: {
                        dashboard_access: (settings.include?("dashboard_access") ? true : false),
                        manage_plan_access: (settings.include?("manage_plan_access") ? true : false),
                        subscription_orders_access: (settings.include?("subscription_orders_access") ? true : false),
                        analytics_access: (settings.include?("analytics_access") ? true : false),
                        installation_access: (settings.include?("installation_access") ? true : false),
                        tiazen_access: (settings.include?("tiazen_access") ? true : false),
                        toolbox_access: (settings.include?("toolbox_access") ? true : false),
                        settings_access: (settings.include?("settings_access") ? true : false),
                        ways_to_earn: (settings.include?("ways_to_earn") ? true : false),
                        customer_modal: (settings.include?("customer_modal") ? true : false),
                        manage_staff: (settings.include?("manage_staff") ? true : false)
                    }
                )
            else
                error = user_shop.errors.messages
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
        session[:shopify_domain]=params[:shopify_domain]
        Shop.find_by_shopify_domain(params[:shopify_domain])&.connect
        render json:{status: :ok}
    end 

    private
    def current_shop shopify_domain
        @current_shop = Shop.find_by_shopify_domain(shopify_domain)
        @current_shop&.connect
        return @current_shop
    end
end