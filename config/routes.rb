Rails.application.routes.draw do
  resources :products do
    get 'reviews', to: 'reviews#index'
    get 'reviews/new'
    post 'reviews', to: 'reviews#create'
  end

  root 'reviews#index'

  
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  # Almost every application defines a route for the root path ("/") at the top of this file.
  # root "articles#index"
end
