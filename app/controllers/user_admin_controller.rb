class UserAdminController  < ActionController::Base
    skip_before_action :verify_authenticity_token
    layout "devise"
    def authenticate_admin
        @user = User.find(params[:id])
        if @user.token_without_password.present?
            unless params[:token]&.strip ==  @user.token_without_password
                @error = "You are not authorize to perform this action"
            end
        else
            @error = "Your account is already registered with password"
        end
        respond_to do |format|
            format.html
        end
    end

    def set_admin_password
        user = User.find(params[:id])
        user.password = params[:set_password]
        user.token_without_password = nil
        if user.save
            sign_in(user)
            render js:"location.replace('/')"
        else
            flas[:notice] = user.errors.full_messages
        end
    end
end