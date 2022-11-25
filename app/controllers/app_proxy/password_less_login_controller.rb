class AppProxy::PasswordLessLoginController < AppProxyController
    def index
        render content_type: 'application/liquid', layout: "#{current_setting&.portal_theme}liquid_app_proxy"
    end

    def send_otp_passwordless_login
        @otp = 6.times.map{rand(1..9)}.join("").to_i
        @email=params[:email]&.downcase&.strip
        #check if user entered email or phone
        if(@email&.to_i == 0)
            contract = CustomerModal.find_by_email(@email)
        else
            phone = "+#{@email&.gsub(/\s+/, "")&.to_i}" 
            contracts = CustomerModal.where("phone = '#{phone}' or address_phone_number = '#{phone}' ") 

            contract = contracts&.first
        end

        if contract.nil?
            @error = "Email or Phone number does not exist in system. Please place an order to have an account automatically created or contact customer support with a screenshot. Error message: Incorrect username or password."
        else
            if contracts.present? && contracts.count > 1
                @error = "We found more than one account associated with this phone number.Please enter the specific email address you intend to login with at this time."
            else
                passwordless_otp = PasswordlessOtp.find_or_initialize_by(email: @email)
                passwordless_otp.otp = @otp
                passwordless_otp.created_at = Time.current
                passwordless_otp.save
                SendEmailService.new.send_otp_passwordless_login(contract, @otp)
                send_otp_sms(contract,@otp)
            end
        end
        respond_to do |format|
            format.js
        end
    end

    def auth_with_otp
        @email=params[:email]&.strip
        passwordless_otp = PasswordlessOtp.find_by_email(@email)
        #check if user entered email or phone
        if(@email&.to_i == 0)
            customer = CustomerModal.find_by_email(@email)
        else
            phone = "+#{@email&.gsub(/\s+/, "")&.to_i}"
            customer =  CustomerModal.where("phone = '#{phone}' or address_phone_number = '#{phone}' ")
            customer = customer&.first
        end

        if passwordless_otp.present? && (passwordless_otp.created_at >= 15.minutes.ago ) && ("#{passwordless_otp&.otp}"&.strip == "#{params[:otp]}"&.strip)
            # set auth code in redis which will expire in 30 minutes
            auth_token = SecureRandom.urlsafe_base64(nil, false)
            $redis.set("#{customer.email}_auth", auth_token, options = {ex: 1800})
            redirect_to "/a/chargezen/dashboard?customer=#{customer&.shopify_id}&token=#{auth_token}"
        else
            render json:{error: "You have entered wrong OTP"}
        end
    end 

    def send_otp_sms(customer,otp)
        customer&.shop&.connect
        message_service = SmsService::MessageGenerateService.new(customer.shop, customer)
        phone = customer.phone || customer.address_phone_number
        message = message_service.content("Login - OTP",otp)
        sent = TwilioServices::SendSms.call(from: customer.shop.phone, to: phone, message: message) rescue nil
    end

    def log_out
        $redis = Redis.new
        $redis.del("#{params[:email]&.downcase&.strip}_auth")
        redirect_to "/a/chargezen/passwordlesslogin"
    end
end