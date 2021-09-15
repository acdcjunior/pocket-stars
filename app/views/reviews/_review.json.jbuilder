json.extract! review, :id, :rating, :review, :created_at, :updated_at
json.url review_url(review, format: :json)
