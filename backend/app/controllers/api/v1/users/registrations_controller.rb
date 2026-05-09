module Api
  module V1
    module Users
      class RegistrationsController < Devise::RegistrationsController
        respond_to :json
        include RackSessionFix

        private

        # def skip_session_storage
        #   [:http_auth]
        # end

        def sign_up_params
          # Use the `user` key even if other keys like `registration` are present
          params.require(:user).permit(:email, :password, :password_confirmation, :name)
        end


        def respond_with(resource, _opts = {})
          if request.method == "POST" && resource.persisted?
            render json: {
              status: { code: 200, message: "Signed up sucessfully." },
              data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
            }, status: :ok
          elsif request.method == "DELETE"
            render json: {
              status: { code: 200, message: "Account deleted successfully." }
            }, status: :ok
          else
            render json: {
              status: { code: 422, message: "User couldn't be created successfully. #{resource.errors.full_messages.to_sentence}" }
            }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end
