# frozen_string_literal: true

Rails.application.routes.draw do
  root 'products#index'

  # /my-product-slug
  match '*path', to: 'reviews#index', via: :get
  match '*path', to: 'reviews#create', via: :post
end
