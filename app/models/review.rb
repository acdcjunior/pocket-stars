# frozen_string_literal: true

class Review < ApplicationRecord
  belongs_to :product
  validates :rating, presence: true, inclusion: { in: [0, 1, 2, 3, 4, 5] }
  validates :review, presence: true, allow_blank: false
  validates :half_star, inclusion: { in: [false, true] }
  validate :zero_rating_not_allowed

  def zero_rating_not_allowed
    errors.add(:half_star, 'zero rating is not allowed') if rating.zero? && !half_star
  end
end
