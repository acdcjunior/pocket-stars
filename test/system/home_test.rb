# frozen_string_literal: true

require 'application_system_test_case'

class HomeTest < ApplicationSystemTestCase
  test 'visiting home' do
    visit root_url

    page.assert_title 'The Minimalist Entrepreneur | Ratings'
    assert_selector 'h1', text: 'The Minimalist Entrepreneur'

    reviews.each do |r|
      assert_text r.rating
      assert_text r.review
    end
  end

  test "'add review' opens modal and creates new review" do
    visit root_url
    click_on 'Add review'
    new_review_text = "Review text!#{random_string}"
    fill_in 'Review', with: new_review_text
    click_on 'Rate as one star'
    click_on 'Submit review'
    assert_text new_review_text
  end
end
