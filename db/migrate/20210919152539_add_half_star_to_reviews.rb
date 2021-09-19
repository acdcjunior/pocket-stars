class AddHalfStarToReviews < ActiveRecord::Migration[6.1]
  def change
    add_column :reviews, :half_star, :boolean
  end
end
