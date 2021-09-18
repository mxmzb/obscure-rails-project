class Review < ApplicationRecord
  belongs_to :product

  validates :rating, :text, :product, :presence => true
end
