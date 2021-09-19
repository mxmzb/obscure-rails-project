class ReviewsController < ApplicationController
  before_action :set_product

  def index
    @reviews = @product.reviews.reverse
    @avg_rating = nil

    if @reviews.size > 0
      @avg_rating = (@reviews.inject(0.0) { |sum, el| sum + el.rating }.to_f / @reviews.size).round(1)
    end
  end

  # this is the same as index for now
  def avg_rating
    @reviews = @product.reviews
    @avg_rating = nil

    if @reviews.size > 0
      @avg_rating = (@reviews.inject(0.0) { |sum, el| sum + el.rating }.to_f / @reviews.size).round(1)
    end
  end

  def new
    @review = Review.new(product: @product)
  end

  def create
    @review = Review.new(review_params)
    @review.product = @product

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

    def set_product
      @product = Product.find(params[:product_id])
    end

end
