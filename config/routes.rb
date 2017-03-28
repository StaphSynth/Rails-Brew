Rails.application.routes.draw do
  resources :ingredients
  resources :recipes
  root 'static_pages#home'

  get 'signup', to: 'users#new'
  get 'home', to: 'static_pages#home'

  resources :users
  resources :hops
  resources :yeasts
  resources :malts
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
