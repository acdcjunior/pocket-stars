ENV['RAILS_ENV'] ||= 'test'
require_relative "../config/environment"
require "rails/test_help"

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors, with: :threads)

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # https://gist.github.com/femoco/87164
  def random_string(length = 5)
    source = ('a'..'z').to_a + ('A'..'Z').to_a + (0..9).to_a + ['_', '-', '.']
    key = ''
    length.times { key += source[rand(source.size)].to_s }
    key
  end
end
