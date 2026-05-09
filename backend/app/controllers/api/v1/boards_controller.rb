class Api::V1::BoardsController < ApplicationController
    before_action :set_board, only: [ :show, :update, :destroy ]
    before_action :authenticate_user!

    # GET /boards
    def index
        is_public = params[:is_public]
        @boards = Board
              .left_joins(:snippets)
              .group("boards.id")
              .select("boards.id, boards.user_id, boards.title, boards.description, boards.is_public, COUNT(snippets.id) AS snippets_count")

        # Conditionally filter by `is_public` if the parameter is present
        if is_public == "true"
            @boards = @boards.where(is_public: is_public)
        else
            # Show only the current user's boards (both public and private)
            @boards = @boards.where(user_id: current_user.id)
        end
        render json: @boards
    end

    # GET /boards/:id
    def show
        render json: @board
    end

    # POST /boards
    def create
        @board = current_user.boards.build(board_params)

        if @board.save
        render json: @board, status: :created
        else
        render json: { errors: @board.errors.full_messages }, status: :unprocessable_entity
        end
    end

    # PATCH/PUT /boards/:id
    def update
        if @board.update(board_params)
        render json: @board
        else
        render json: { errors: @board.errors.full_messages }, status: :unprocessable_entity
        end
    end

    # DELETE /boards/:id
    def destroy
        @board.destroy
        head :no_content
    end

    private

    def set_board
        @board = current_user.boards.find(params[:id])
    rescue ActiveRecord::RecordNotFound
        render json: { error: "Board not found" }, status: :not_found
    end

    def board_params
        params.require(:board).permit(:title, :description, :is_public)
    end
end
