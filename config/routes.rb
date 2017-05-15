Rails.application.routes.draw do
  root 'static_pages#home'

  get     '/login',   to: 'sessions#new'
  post    '/login',   to: 'sessions#create'
  delete  '/logout',  to: 'sessions#destroy'
  get     '/signup',  to: 'users#new'
  get     'home',     to: 'static_pages#home'
  get     'about',    to: 'static_pages#about'

  resources :account_activations, :only => [:edit]
  resources :recipes
  resources :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
