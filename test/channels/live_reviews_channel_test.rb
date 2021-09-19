# frozen_string_literal: true

require 'test_helper'

class LiveReviewsChannelTest < ActionCable::Channel::TestCase
  test 'subscribes confirms subscription, streams from live_reviews and transmits all reviews' do
    subscribe
    assert subscription.confirmed?
    assert_has_stream 'live_reviews'
    assert_equal Review.all, transmissions.last['reviews']
  end
end
