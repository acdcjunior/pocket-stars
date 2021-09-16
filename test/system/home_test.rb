require 'application_system_test_case'

class HomeTest < ApplicationSystemTestCase
  test 'visiting home' do
    visit root_url

    page.assert_title 'The Minimalist Entrepreneur | Ratings'
    assert_selector "h1", text: "The Minimalist Entrepreneur"

    reviews.each do |r|
      assert_text r.rating
      assert_text r.review
    end
  end
end
