Rails.application.routes.draw do
  get 'hello_world', to: 'hello_world#index'
  get 'password_resets/new'

  get 'password_resets/edit'

  root 'static_pages#home'

  get     '/login',          to: 'sessions#new'
  post    '/login',          to: 'sessions#create'
  delete  '/logout',         to: 'sessions#destroy'
  get     '/signup',         to: 'users#new'
  get     'home',            to: 'static_pages#home'
  get     'about',           to: 'static_pages#about'
  get     '/preferences',    to: 'user_preferences#edit'
  post    '/ratings/create', to: 'ratings#create'
  get     '/recipes/styles', to: 'recipes#styles'
  get     '/style-guide',    to: 'recipes#style_guide'
  get     '/recipes/ingredient_data', to: 'recipes#ingredient_data'

  resources :account_activations, :only => [:edit]
  resources :password_resets, :only => [:new, :create, :edit, :update]
  resources :recipes
  resources :users
  resources :ratings, :only => [:new, :create, :edit, :update]
  resources :user_preferences, :only => [:new, :create, :edit, :update]
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
