# frozen_string_literal: true

class ProductsController < ApplicationController
  # GET /products or /products.json
  def index
    @products = Product.all
  end

  # GET /products/slug
  def show
    @product = Product.where(slug: params[:slug])[0]
    render json: @product
  end
end
