class LiveReviewsChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'live_reviews'

    # as the users connect, send them all reviews
    product = Product.where(slug: params[:project])[0]
    transmit({ reviews: Review.where(product_id: product.id) })
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
