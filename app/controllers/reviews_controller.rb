class ReviewsController < ApplicationController
  before_action :set_product

  # don't need csrf token security for api requests
  protect_from_forgery with: :null_session, if: -> { request.format.json? }

  def index
    @reviews = @product.reviews.reverse
    @avg_rating = nil

    if @reviews.size > 0
      @avg_rating = (@reviews.inject(0.0) { |sum, el| sum + el.rating }.to_f / @reviews.size).round(1)
    end
  end

  def show
    @review = Review.find(params[:id])
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
    @review = @product.reviews.build(review_params)

    respond_to do |format|
      if @product.save
        ActionCable.server.broadcast 'ProductChannel', JSON.parse(
          render_to_string(
            partial: "products/product",
            locals: { product: @product }
          )
        )
        format.html { redirect_to @review, notice: "Review was successfully created." }
        format.json { render :show, status: :created, location: [@review.product, @review] }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @review.errors, status: :unprocessable_entity }
      end
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
