Rails.application.routes.draw do
  get 'password_resets/new'

  get 'password_resets/edit'

  root 'static_pages#home'

  get     '/login',   to: 'sessions#new'
  post    '/login',   to: 'sessions#create'
  delete  '/logout',  to: 'sessions#destroy'
  get     '/signup',  to: 'users#new'
  get     'home',     to: 'static_pages#home'
  get     'about',    to: 'static_pages#about'

  resources :account_activations, :only => [:edit]
  resources :password_resets, :only => [:new, :create, :edit, :update]
  resources :recipes
  resources :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
