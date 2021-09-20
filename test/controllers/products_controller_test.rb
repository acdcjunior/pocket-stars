# frozen_string_literal: true

require 'test_helper'

class ProductsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @product = products(:one)
    @product_two = products(:two)
  end

  test 'should get product list' do
    get products_url
    assert_response :success
    assert_select 'h1', 'Products'
    assert_select "a[href$=#{@product.slug}]", @product.name
    assert_select "a[href$=#{@product_two.slug}]", @product_two.name
  end

  test 'should show product' do
    p products_url
    get "#{products_url}/#{@product.slug}"

    assert_response :success
    p @response.parsed_body
    assert_equal @product.slug, @response.parsed_body['slug']
    assert_equal @product.name, @response.parsed_body['name']
  end
end
