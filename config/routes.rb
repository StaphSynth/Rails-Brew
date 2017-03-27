Rails.application.routes.draw do
  get 'static_pages/home'

  get 'static_pages/signup'

  root 'static_pages#home'

  resources :users
  resources :hops
  resources :yeasts
  resources :malts
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
