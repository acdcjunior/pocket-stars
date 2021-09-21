# frozen_string_literal: true

require 'test_helper'

class ProductsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @product = products(:one)
    @product_two = products(:two)
  end

  test 'should get product list' do
    get root_url
    assert_response :success
    assert_select 'h1', 'Products'
    assert_select "a[href$=#{@product.slug}]", @product.name
    assert_select "a[href$=#{@product_two.slug}]", @product_two.name
  end
end
