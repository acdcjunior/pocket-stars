# frozen_string_literal: true

Rails.application.routes.draw do
  resources :products, param: :slug
  resources :reviews

  root 'products#index'

  # route /product-slug
  match '*path', to: 'home#index', via: :get
end
