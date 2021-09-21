# frozen_string_literal: true

require 'application_system_test_case'

class ReviewsTest < ApplicationSystemTestCase
  add_review_button_label = 'Add review'
  star_selector = '.star'
  highlighted_star_selector = '.star.star-full'

  review_on_review_list_selector = 'li.review'

  whats_your_rating_header_text = 'What’s your rating?'
  highlighted_stars_on_new_review_form_selector = '#new-rating-stars .star.star-full'
  one_star_label = 'Rate as one star'
  new_review_textarea_selector = '#new-review-review-textarea'
  submit_review_button_label = 'Submit review'

  setup do
    @product = products(:one)
  end

  test 'visiting product reviews' do
    visit_product_one_reviews

    page.assert_title "#{@product.name} | Reviews"
    assert_selector 'h1', text: @product.name

    reviews.each do |r|
      if r.product_id == @product.id
        assert_text r.rating
        assert_text r.review
      end
    end
  end

  test "'add review' modal is absent on page init and appears on click" do
    visit_product_one_reviews

    assert_no_text whats_your_rating_header_text
    click_on add_review_button_label
    assert_text whats_your_rating_header_text
  end

  test "'add review' opens modal and creates new review" do
    # given
    visit_product_one_reviews
    # when
    click_on add_review_button_label
    new_review_text = "Review text! #{random_string}"
    find(new_review_textarea_selector).send_keys new_review_text
    click_on one_star_label
    click_on submit_review_button_label
    # then
    assert_text new_review_text
    li_containing_new_review_text = find('span', text: new_review_text).find(:xpath, '..')
    expect(li_containing_new_review_text).to have_css(star_selector, count: 5)
    expect(li_containing_new_review_text).to have_css(highlighted_star_selector, count: 1)
  end

  test "'add review' form is cleared after creation" do
    # given
    visit_product_one_reviews
    click_on add_review_button_label
    find(new_review_textarea_selector).send_keys random_string
    click_on one_star_label
    # when
    click_on submit_review_button_label
    # then
    click_on add_review_button_label

    expect(page).to have_css(highlighted_stars_on_new_review_form_selector, count: 0)
    expect(page).to have_css(new_review_textarea_selector, text: '')
  end

  test 'invalid review does not insert a new review' do
    # given
    visit_product_one_reviews
    number_of_reviews_when_page_was_loaded = page.all(review_on_review_list_selector).count

    click_on add_review_button_label
    click_on submit_review_button_label

    expect(page).to have_css(review_on_review_list_selector, count: number_of_reviews_when_page_was_loaded)
    assert_text whats_your_rating_header_text
  end

  test 'escape closes modal' do
    # given
    visit_product_one_reviews

    click_on add_review_button_label
    assert_text whats_your_rating_header_text

    find(new_review_textarea_selector).send_keys(:escape)
    assert_no_text whats_your_rating_header_text
  end

  private

  def visit_product_one_reviews
    visit "#{root_url}/#{@product.slug}"
  end
end
