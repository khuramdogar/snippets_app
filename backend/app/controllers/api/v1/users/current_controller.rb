module Api
  module V1
    module Users
      class CurrentController < ApplicationController
        before_action :authenticate_user!

        def show
          render json: {
            data: UserSerializer.new(current_user).serializable_hash[:data][:attributes]
          }, status: :ok
        end
      end
    end
  end
end
