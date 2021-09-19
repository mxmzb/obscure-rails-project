Rails.application.routes.draw do
  resources :products do
    get 'reviews', to: 'reviews#index'
    get 'reviews/new'
    get 'reviews/avg_rating', to: 'reviews#avg_rating'
    post 'reviews', to: 'reviews#create'
  end

  root 'products#index'

  
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  # Almost every application defines a route for the root path ("/") at the top of this file.
  # root "articles#index"
end
