# frozen_string_literal: true

require 'test_helper'

class ReviewsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @review = reviews(:r1)
  end

  test 'should get index' do
    get reviews_url
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

  # TODO: actions below are kept temporarily for development purposes, they wont be in the MVP
  test 'should get new' do
    get new_review_url
    assert_response :success
  end

  test 'should get edit' do
    get edit_review_url(@review)
    assert_response :success
  end

  test 'should update review' do
    patch review_url(@review), as: :json, params: { review: { rating: @review.rating, review: @review.review } }
    assert_response :success
  end

  test 'should destroy review' do
    assert_difference('Review.count', -1) do
      delete review_url(@review)
    end

    assert_response :success
  end
end
