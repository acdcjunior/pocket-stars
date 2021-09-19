class LiveReviewsChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'live_reviews'
    # as the users connect, send them all reviews
    transmit({ reviews: Review.all })
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
