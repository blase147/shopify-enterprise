class LanguageController < ActionController::Base
    def current_language
        render json:{shop: session[:shop]}
    end

    def set_language
        I18n.locale = "en"
    end
end