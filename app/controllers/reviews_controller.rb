class ReviewsController < ApplicationController

  def index
    @reviews = Review.all
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
