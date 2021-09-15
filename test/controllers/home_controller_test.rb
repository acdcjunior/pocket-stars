require 'test_helper'

class HomeControllerTest < ActionDispatch::IntegrationTest
  test 'should get home/index' do
    get root_path
    assert_response :success
    assert_select 'title', 'The Minimalist Entrepreneur | Ratings'
  end
end
