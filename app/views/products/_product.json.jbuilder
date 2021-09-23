json.extract! product, :id, :name, :created_at, :updated_at
json.reviews product.reviews.reverse
json.average_rating (product.reviews.inject(0.0) { |sum, el| sum + el.rating }.to_f / product.reviews.size).round(1)