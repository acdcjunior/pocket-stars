require "test_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium, using: :chrome, screen_size: [1400, 1400]

  Capybara.configure do |config|
    config.enable_aria_label = true
    config.enable_aria_role = true
  end
end
