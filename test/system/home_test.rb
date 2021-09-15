require 'application_system_test_case'

class HomeTest < ApplicationSystemTestCase
  test 'visiting home' do
    visit root_path

    page.assert_title 'The Minimalist Entrepreneur | Ratings'
  end
end
