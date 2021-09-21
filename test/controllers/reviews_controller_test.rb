# frozen_string_literal: true

require 'test_helper'

class ReviewsControllerTest < ActionDispatch::IntegrationTest
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
      post @product_reviews_url, as: :json, params: { review: { rating: @review.rating, review: @review.review } }
    end

    assert_response 201
    assert_equal true, @response.parsed_body # jquery requires that HTTP status 201 has content, otherwise $.ajax will invoke the error callback
  end

  test 'should validate rating' do
    post @product_reviews_url, as: :json, params: { review: { rating: 0, review: 'hey' } }

    assert_response 422
  end

  test 'should validate review (text prop)' do
    post @product_reviews_url, as: :json, params: { review: { rating: 1, review: '' } }

    assert_response 422
  end
end
