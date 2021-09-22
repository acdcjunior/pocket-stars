class LiveReviewsChannel < ApplicationCable::Channel
  def subscribed
    product = Product.where(slug: params[:product])[0]
    stream_for product

    # as the users connect, send them all reviews
    transmit({ reviews: Review.where(product_id: product.id) })
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
