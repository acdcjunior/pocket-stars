# frozen_string_literal: true

require 'test_helper'
require 'capybara/rspec'

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  # driven_by :selenium, using: :chrome, screen_size: [1400, 1400]
  driven_by :selenium, using: :headless_chrome

  include RSpec::Matchers
  include Capybara::RSpecMatchers

  Capybara.configure do |config|
    config.enable_aria_label = true
    config.enable_aria_role = true
  end
end
