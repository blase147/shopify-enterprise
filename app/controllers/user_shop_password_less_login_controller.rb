class UserShopPasswordLessLoginController < ActionController::Base
    skip_before_action :verify_authenticity_token
    layout "user_shop_passwordless_login"
    def index
    end

    def send_otp_passwordless_login
        @otp = 6.times.map{rand(1..9)}.join("").to_i
        @email=params[:email]&.downcase&.strip
        user = User.find_by_email(@email)

        if user.nil?
            @error = "Email does not exist in system. Please sign up or contact customer support with a screenshot. Error message: Incorrect username or password."
        else
                passwordless_otp = PasswordlessOtp.find_or_initialize_by(email: @email)
                passwordless_otp.otp = @otp
                passwordless_otp.created_at = Time.current
                passwordless_otp.save
                SendEmailService.new.send_otp_user_shop_passwordless_login(user, @otp)
        end
        respond_to do |format|
            format.js
        end
    end

    def auth_with_otp
        @email=params[:email]&.strip
        passwordless_otp = PasswordlessOtp.find_by_email(@email)
        #check if user entered email
        user = User.find_by_email(@email)

        if passwordless_otp.present? && (passwordless_otp.created_at >= 15.minutes.ago ) && ("#{passwordless_otp&.otp}"&.strip == "#{params[:otp]}"&.strip)
            sign_in(user)
            render js: "location.replace('/');"
        else
            render json:{error: "You have entered wrong OTP"}
        end
    end 

    def registered_on_mixpanel
        @user = current_user
        respond_to do |format|
            format.html
        end
    end

    def save_mixpanel_id
        user = User.find(params[:user_local_id])
        user.update(mixpanel_id: params[:mixpanel_id])
        render js: "location.replace('/')"
    end

end