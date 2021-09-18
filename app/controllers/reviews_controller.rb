class ReviewsController < ApplicationController

  def index
    @reviews = Review.all

    @avg_rating = (@reviews.inject(0.0) { |sum, el| sum + el.rating }.to_f / @reviews.size).round(1)
  end

  def new
    @review = Review.new
  end

  def create
    @review = Review.new(review_params)

    if @review.save
      render :show, status: :created
    else
      render :new, status: :unprocessable_entity
    end
  end

  private
    def review_params
      params.require(:review).permit(:rating, :text)
    end

end
