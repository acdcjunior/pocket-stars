# frozen_string_literal: true

require 'application_system_test_case'

class HomeTest < ApplicationSystemTestCase
  add_review_button_label = 'Add review'
  whats_your_rating_header_text = "What's your rating?"
  one_star_label = 'Rate as one star'
  new_review_textarea_label = 'Review'
  submit_review_button_label = 'Submit review'

  test 'visiting home' do
    visit root_url

    page.assert_title 'The Minimalist Entrepreneur | Ratings'
    assert_selector 'h1', text: 'The Minimalist Entrepreneur'

    reviews.each do |r|
      assert_text r.rating
      assert_text r.review
    end
  end

  test "'add review' modal is absent on page init and appears on click" do
    visit root_url

    assert_no_text whats_your_rating_header_text
    click_on add_review_button_label
    assert_text whats_your_rating_header_text
  end

  test "'add review' opens modal and creates new review" do
    visit root_url
    click_on add_review_button_label
    new_review_text = "Review text! #{random_string}"
    fill_in new_review_textarea_label, with: new_review_text
    click_on one_star_label
    click_on submit_review_button_label
    assert_text new_review_text
  end
end
