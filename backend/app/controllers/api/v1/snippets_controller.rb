module Api
  module V1
    class SnippetsController < ApplicationController
      def index
        snippets = Snippet
          .includes(:tags, :snippet_likes, snippet_comments: :user)
          .where(is_public: true)
          .order(created_at: :desc)

        render json: snippets.map { |snippet| snippet_json(snippet) }, status: :ok
      end

      def show
        snippet = Snippet.includes(:tags, :snippet_likes, snippet_comments: :user).find(params[:id])
        render json: snippet_json(snippet, include_comments: true), status: :ok
      end

      def create
        snippet = Snippet.new(snippet_params)
        if snippet.save
          render json: snippet_json(snippet), status: :created
        else
          render json: { errors: snippet.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        snippet = Snippet.find(params[:id])
        if snippet.update(snippet_params)
          render json: snippet_json(snippet), status: :ok
        else
          render json: { errors: snippet.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        snippet = Snippet.find(params[:id])
        snippet.destroy
        head :no_content
      end

      def like
        authenticate_user!
        snippet = Snippet.find(params[:id])
        snippet.snippet_likes.find_or_create_by!(user: current_user)

        render json: snippet_json(snippet.reload), status: :ok
      end

      def unlike
        authenticate_user!
        snippet = Snippet.find(params[:id])
        snippet.snippet_likes.where(user: current_user).destroy_all

        render json: snippet_json(snippet.reload), status: :ok
      end

      def save_to_board
        authenticate_user!
        source = Snippet.find(params[:id])
        return render json: { message: "Only public snippets can be saved." }, status: :forbidden unless source.is_public?

        board = current_user.boards.find(params.require(:board_id))
        copy = board.snippets.create!(
          title: source.title,
          description: source.description,
          content: source.content,
          language: source.language,
          is_public: false
        )

        render json: snippet_json(copy), status: :created
      end

      private

      def snippet_json(snippet, include_comments: false)
        comments = snippet.snippet_comments.order(created_at: :desc).map do |comment|
          {
            id: comment.id,
            body: comment.body,
            created_at: comment.created_at,
            user: {
              id: comment.user.id,
              name: comment.user.name,
              email: comment.user.email
            }
          }
        end

        {
          id: snippet.id,
          title: snippet.title,
          description: snippet.description,
          content: snippet.content,
          language: snippet.language,
          is_public: snippet.is_public,
          board_id: snippet.board_id,
          created_at: snippet.created_at,
          likes_count: snippet.snippet_likes.size,
          comments_count: snippet.snippet_comments.size,
          liked_by_me: current_user ? snippet.snippet_likes.any? { |like| like.user_id == current_user.id } : false,
          comments: include_comments ? comments : comments.first(2)
        }
      end

      def snippet_params
        params.require(:snippet).permit(:title, :description, :content, :board_id, :is_public, :language, tag_ids: [])
      end
    end
  end
end
