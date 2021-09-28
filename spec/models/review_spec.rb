require 'rails_helper'

RSpec.describe Review, :type => :model do
  it "is not valid with a rating of 4.45" do
    product = Product.create(name: "The bad entrepreneur")
    expect(Review.new(text: "foo", rating: 4.45, product_id: product.id)).to_not be_valid
  end

  it "is valid with valid attributes" do
    product = Product.create(name: "The bad entrepreneur")
    expect(Review.new(text: "foo", rating: 4.5, product_id: product.id)).to be_valid
  end
end