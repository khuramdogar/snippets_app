Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  get 'users/current', to: 'api/v1/users/current#show'

  devise_for :users, controllers: {
    registrations: 'api/v1/users/registrations',
    sessions: 'api/v1/users/sessions',
    passwords: 'api/v1/users/passwords'
  }

  namespace :api do
    namespace :v1 do
      get 'users/current', to: 'users/current#show'
      # devise_for :users, path: '', path_names: {
      #   sign_in: 'login',
      #   sign_out: 'logout',
      #   registration: 'signup'
      # }, controllers: {
      #   registrations: 'api/v1/users/registrations',
      #   sessions: 'api/v1/users/sessions',
      #   passwords: 'api/v1/users/passwords'
      # }
      resources :boards do
        resources :snippets, only: [:index], controller: 'boards/snippets'
      end
      resources :snippets do
        member do
          post :like
          delete 'like', action: :unlike
          post :save_to_board
        end

        resources :comments, only: [:create], controller: 'snippets/comments'
      end
      resources :tags
    end
  end

end
