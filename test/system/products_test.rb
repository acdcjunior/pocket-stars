# frozen_string_literal: true

require 'application_system_test_case'

class ProductsTest < ApplicationSystemTestCase
  # smoke test. The page is so simple the controller test is enough to test everything
  test 'visiting the product list' do
    visit products_url
    assert_selector 'h1', text: 'Products'
  end
end
