Rails.application.routes.draw do
  root 'static_pages#home'

  get 'signup', to: 'static_pages#signup'
  get 'home', to: 'static_pages#home'

  resources :users
  resources :hops
  resources :yeasts
  resources :malts
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
