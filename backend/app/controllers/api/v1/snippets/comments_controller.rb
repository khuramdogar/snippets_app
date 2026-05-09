module Api
  module V1
    module Snippets
      class CommentsController < ApplicationController
        before_action :authenticate_user!

        def create
          snippet = Snippet.find(params[:snippet_id])
          comment = snippet.snippet_comments.create!(
            user: current_user,
            body: params.require(:comment).require(:body)
          )

          render json: {
            id: comment.id,
            body: comment.body,
            created_at: comment.created_at,
            user: {
              id: current_user.id,
              name: current_user.name,
              email: current_user.email
            }
          }, status: :created
        end
      end
    end
  end
end
