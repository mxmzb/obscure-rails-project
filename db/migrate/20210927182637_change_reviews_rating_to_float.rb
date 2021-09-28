class ChangeReviewsRatingToFloat < ActiveRecord::Migration[7.0]
  def change
    change_column :reviews, :rating, :float
  end
end
