# frozen_string_literal: true

require 'test_helper'

class ReviewsControllerTest < ActionDispatch::IntegrationTest
  include ActionCable::Channel::TestCase::Behavior

  setup do
    @product = products(:one)
    @review = reviews(:r1)

    @product_reviews_url = "#{root_path}/#{@product.slug}"
  end

  test 'should get reviews as html' do
    get @product_reviews_url, as: :html
    assert_response :success
    assert_select 'title', "#{@product.name} | Reviews"
  end

  test 'should get reviews as json' do
    get @product_reviews_url, as: :json
    assert_response :success

    obtained_reviews = @response.parsed_body
    assert_equal 3, obtained_reviews.length
    assert_equal 4, obtained_reviews[0]['rating']
    assert_equal 'book was amazing', obtained_reviews[2]['review']
  end

  test 'should return NOT FOUND if project does not exist' do
    assert_raises(ActionController::RoutingError) do
      get "#{root_path}/some-project-slug-that-does-not-exist", as: :html
    end
  end

  test 'should create review' do
    assert_difference('Review.count') do
      post @product_reviews_url, as: :json, params: { review: { rating: @review.rating, review: @review.review, half_star: @review.half_star } }
    end

    assert_response 201
    assert_equal true, @response.parsed_body # jquery requires that HTTP status 201 has content, otherwise $.ajax will invoke the error callback
  end

  test 'should validate rating' do
    post @product_reviews_url, as: :json, params: { review: { rating: 6, review: @review.review, half_star: false } }

    assert_response 422
  end

  test 'should validate review (text prop)' do
    post @product_reviews_url, as: :json, params: { review: { rating: 1, review: '', half_star: false } }

    assert_response 422
  end

  test 'should allow 0.5 rating' do
    post @product_reviews_url, as: :json, params: { review: { rating: 0, review: @review.review, half_star: true } }
    assert_response 201
  end

  test 'should forbid 0.0 rating' do
    post @product_reviews_url, as: :json, params: { review: { rating: 0, review: @review.review, half_star: false } }
    assert_response 422
  end

  test 'create review should broadcast new review to live_reviews stream' do
    post @product_reviews_url, as: :json, params: { review: { rating: @review.rating, review: @review.review, half_star: @review.half_star } }
    assert_broadcasts 'live_reviews', 1

    # assert_broadcast_on('live_reviews', @review) will not work here, as it checks all properties of the objects and the ids will be different
    # if assert_broadcast_on allowed partial checking we would use it, but it doesn't
    # as a workaround, I checked assert_broadcast_on inner workings:
    # https://github.com/rails/rails/blob/v6.1.4.1/actioncable/lib/action_cable/test_helper.rb#L97-L120
    # and used the `broadcasts` function + JSON.decode as it does
    recently_broadcast_review = ActiveSupport::JSON.decode(broadcasts('live_reviews')[0])['reviews'][0]
    assert_equal @review.rating, recently_broadcast_review['rating']
    assert_equal @review.review, recently_broadcast_review['review']
    assert_equal @review.half_star, recently_broadcast_review['half_star']
  end
end
