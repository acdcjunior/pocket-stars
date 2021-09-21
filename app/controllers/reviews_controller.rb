# frozen_string_literal: true

class ReviewsController < ApplicationController
  before_action :set_product, only: %i[index create]

  def index
    respond_to do |format|
      format.html do
        render :index
      end
      format.json do
        render json: Review.where(product_id: @product.id)
      end
    end
  end

  def create
    review = Review.new(review_params.to_h.merge({ 'product_id' => @product.id }))

    if review.save
      ActionCable.server.broadcast('live_reviews', { reviews: [review] })
      render json: true, status: :created # jQuery requires content for 201 status; returning true as dummy
    else
      render json: review.errors, status: :unprocessable_entity
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_product
    @product = Product.where(slug: params[:path])[0]
    raise ActionController::RoutingError, 'Not Found' if @product.nil?
  end

  # Only allow a list of trusted parameters through.
  def review_params
    params.require(:review).permit(:rating, :review, :half_star)
  end
end
