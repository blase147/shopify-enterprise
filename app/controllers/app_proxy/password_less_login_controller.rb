class AppProxy::PasswordLessLoginController < AppProxyController
    def index
        render content_type: 'application/liquid', layout: "#{current_setting.portal_theme}liquid_app_proxy"
    end

    def send_otp_passwordless_login
        @otp = 6.times.map{rand(1..9)}.join("").to_i
        @email=params[:email]&.downcase&.strip
        contract = CustomerSubscriptionContract.find_by_email(@email)
        if contract.nil?
            @error = "Email does not exist in system. Please place an order to have an account automatically created or contact customer support with a screenshot. Error message: Incorrect username or password."
        else
            passwordless_otp = PasswordlessOtp.find_or_initialize_by(email: @email)
            passwordless_otp.otp = @otp
            passwordless_otp.created_at = Time.current
            passwordless_otp.save
            SendEmailService.new.send_otp_passwordless_login(contract, @otp)
        end
        respond_to do |format|
            format.js
        end
    end

    def auth_with_otp
        @email=params[:email]&.strip
        passwordless_otp = PasswordlessOtp.find_by_email(@email)
        customer = CustomerSubscriptionContract.find_by_email(@email)

        if passwordless_otp.present? && (passwordless_otp.created_at >= 15.minutes.ago ) && ("#{passwordless_otp&.otp}"&.strip == "#{params[:otp]}"&.strip)
            # set auth code in redis which will expire in 30 minutes
            auth_token = SecureRandom.urlsafe_base64(nil, false)
            $redis.set("#{customer.email}_auth", auth_token, options = {ex: 1800})
            redirect_to "/a/chargezen_production/dashboard?customer_id=#{customer&.shopify_customer_id}&admin_refcode=#{auth_token}"
        else
            render json:{error: "You have entered wrong OTP"}
        end
    end 
end