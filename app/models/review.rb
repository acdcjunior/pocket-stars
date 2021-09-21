# frozen_string_literal: true

class Review < ApplicationRecord
  belongs_to :product
  validates :rating, presence: true, inclusion: { in: [1, 2, 3, 4, 5] }
  validates :review, presence: true, allow_blank: false
end
