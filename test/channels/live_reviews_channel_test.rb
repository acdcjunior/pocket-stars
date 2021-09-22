# frozen_string_literal: true

require 'test_helper'

class LiveReviewsChannelTest < ActionCable::Channel::TestCase
  setup do
    @product = products(:one)
  end

  test 'subscribes confirms subscription, streams from live_reviews and
              transmits all reviews of given project only' do
    subscribe product: @product.slug

    assert subscription.confirmed?
    assert_has_stream_for @product
    assert_equal Review.where(product_id: @product.id), transmissions.last['reviews']
  end
end
