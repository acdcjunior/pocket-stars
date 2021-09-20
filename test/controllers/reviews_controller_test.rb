# frozen_string_literal: true

require 'test_helper'

class ReviewsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @review = reviews(:r1)
  end

  test 'should get reviews as html' do
    get reviews_url, as: :html
    assert_response :success
    assert_select 'title', 'The Minimalist Entrepreneur | Ratings'
  end

  test 'should get reviews as json' do
    get reviews_url, as: :json
    assert_response :success

    obtained_reviews = @response.parsed_body
    assert_equal 3, obtained_reviews.length
    assert_equal 4, obtained_reviews[0]['rating']
    assert_equal 'book was amazing', obtained_reviews[2]['review']
  end

  test 'should create review' do
    assert_difference('Review.count') do
      post reviews_url, as: :json, params: { review: { rating: @review.rating, review: @review.review } }
    end

    assert_response 201
    assert_equal true, @response.parsed_body # jquery requires that HTTP status 201 has content, otherwise $.ajax will invoke the error callback
  end

  test 'should validate rating' do
    post reviews_url, as: :json, params: { review: { rating: 0, review: 'hey' } }

    assert_response 422
  end

  test 'should validate review (text prop)' do
    post reviews_url, as: :json, params: { review: { rating: 1, review: '' } }

    assert_response 422
  end
end
