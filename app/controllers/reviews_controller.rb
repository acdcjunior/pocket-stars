# frozen_string_literal: true

class ReviewsController < ApplicationController
  # GET /reviews - lists all reviews
  def index
    respond_to do |format|
      format.html do
        @product = Product.where(slug: params[:path])[0]
        raise ActionController::RoutingError, 'Not Found' if @product.nil?

        render :index
      end
      format.json { render json: Review.all }
    end
  end

  # POST /reviews - creates new reviews
  def create
    @review = Review.new(review_params)

    if @review.save
      render json: true, status: :created # jQuery requires content for 201 status; returning true as dummy
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  # TODO: actions below are kept temporarily for development purposes, they wont be in the MVP
  # VIEW GET /reviews/new
  def new
    @review = Review.new
  end

  # Only allow a list of trusted parameters through.
  def review_params
    params.require(:review).permit(:rating, :review)
  end
end
