# frozen_string_literal: true

Rails.application.routes.draw do
  resources :products, param: :slug
  resources :reviews

  root 'products#index'

  # route /product-slug
  match '*path', to: 'reviews#index', via: :get
end
