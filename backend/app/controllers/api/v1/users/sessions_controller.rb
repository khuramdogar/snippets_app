module Api
  module V1
    module Users
      class SessionsController < Devise::SessionsController
        include RackSessionFix
        respond_to :json

        private

        # def respond_with(resource, _opts = {})
        #   set_access_token_cookie_from_header

        #   render json: {
        #     status: {code: 200, message: 'Logged in sucessfully.'},
        #     data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
        #   }, status: :ok
        # end
        def respond_with(resource, _opts = {})
          new_access_token_cookie

          render json: {
            status: {
              code: 200,
              message: 'Logged in successfully.'
            },
            data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
          }, status: :ok
        end

        def respond_to_on_destroy
          delete_access_token_cookie

          if current_user
            render json: {
              status: 200,
              message: "logged out successfully"
            }, status: :ok
          else
            render json: {
              status: 401,
              message: "Couldn't find an active session."
            }, status: :unauthorized
          end
        end

        def new_access_token_cookie
          token, payload = Warden::JWTAuth::UserEncoder.new.call(resource, :user, nil)

          cookies[:access_token] = {
            value: token,
            httponly: true,
            secure: Rails.env.production?,
            same_site: :lax,
            expires: 1.day.from_now
          }
        end

        # def set_access_token_cookie_from_header
        #   token_header = response.headers['Authorization']
        #   Rails.logger.info "Incoming token_header: #{token_header}"
        #   Rails.logger.info "Incoming token_header: #{token_header.present?}"
        #   return unless token_header.present?

        #   token = token_header.split.last
        #   cookies[:access_token] = {
        #     value: token,
        #     httponly: true,
        #     secure: false,
        #     same_site: :lax,
        #     expires: 1.day.from_now
        #   }
        # end

        def delete_access_token_cookie
          cookies.delete(:access_token, same_site: :lax, secure: Rails.env.production?)
        end
      end
    end
  end
end
