class ApplicationController < ActionController::API
    include ActionController::Cookies
    include Devise::Controllers::Helpers
    before_action :log_params
    before_action :set_authorization_header_from_cookie
    before_action :configure_permitted_parameters, if: :devise_controller?


    protected

    def configure_permitted_parameters
        # Permit additional attributes for sign_up
        devise_parameter_sanitizer.permit(:name)
    end

    private

    def log_params
        Rails.logger.info "Incoming parameters: #{params.inspect}"
    end

    def set_authorization_header_from_cookie
        return if request.headers["Authorization"].present?

        token = cookies[:access_token]
        return if token.blank?

        request.env["HTTP_AUTHORIZATION"] ||= "Bearer #{token}"
    end
end
