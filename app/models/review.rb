class Review < ApplicationRecord
  belongs_to :product

  validates :rating, :text, :product, :presence => true

  validates :rating, numericality: { 
    greater_than_or_equal_to: 1,
    less_than_or_equal_to: 5
  }

  validate :rating_value

  # make sure only floats with .0 or .5 decimal is valid
  private
    def rating_value
      unless rating % 0.5 === 0
        errors.add :rating, "has invalid value"
      end
    end
end
