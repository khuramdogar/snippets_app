module Api
    module V1
      module Boards
        class SnippetsController < ApplicationController
          before_action :set_board
    
            def index
              @snippets = @board.snippets
              render json: @snippets
            end

            private

            def set_board
              @board = Board.find(params[:board_id])
              rescue ActiveRecord::RecordNotFound
              render json: { error: 'Board not found' }, status: :not_found
            end
        end
      end
    end
  end
