# frozen_string_literal: true

class ReviewsController < ApplicationController
  before_action :set_review, only: %i[show edit update destroy]

  # GET /reviews - lists all reviews
  def index
    render json: Review.all
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

  # VIEW GET /reviews/1/edit
  def edit; end

  # used by edit view
  def update
    if @review.update(review_params)
      render json: true, status: :ok
    else
      render json: @review.errors, status: :unprocessable_entity
    end
  end

  # used by edit view
  def destroy
    @review.destroy
    head :no_content
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_review
    @review = Review.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def review_params
    params.require(:review).permit(:rating, :review)
  end
end
