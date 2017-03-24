Rails.application.routes.draw do
  get 'home/index'

  root 'home#index'

  resources :hops
  resources :yeasts
  resources :malts
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
