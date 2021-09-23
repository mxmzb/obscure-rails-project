import React from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import axios from "axios";

import ReviewsList from "./ReviewsList";
import AverageRating from "./AverageRating";
import Modal from "./Modal";
import CreateReviewForm from "./CreateReviewForm";

const Reviews = ({ productId }) => {
  const [showCreateReviewForm, setShowCreateReviewForm] = React.useState(false);
  const { isLoading, error, data } = useQuery(
    ["product", productId],
    async () => (await axios.get(`/products/${productId}.json`)).data,
  );

  if (isLoading) return "Loading...";

  const { id, name, reviews, average_rating } = data;

  return (
    <>
      <h1>{name}</h1>
      <div className="h-6"></div>

      <div className="flex items-center justify-between">
        <AverageRating value={average_rating} />

        <a
          href="#"
          className="flex items-center cursor-pointer h-10 px-8 rounded bg-white text-gray-500 font-bold border border-gray-400 shadow"
          id="add-review-button"
          data-modal="open"
          data-path="<%= product_reviews_new_path(@product) %>"
          data-element="#new-review"
          onClick={(e) => {
            e.preventDefault();
            setShowCreateReviewForm(true);
          }}
        >
          Add review
        </a>
      </div>

      <div className="h-6"></div>
      <div className="border b-bottom border-color-gray-500"></div>
      <div className="h-6"></div>
      <ReviewsList reviews={reviews} />
      <Modal show={showCreateReviewForm} onClose={() => setShowCreateReviewForm(false)}>
        <CreateReviewForm productId={productId} onSubmit={() => setShowCreateReviewForm(false)} />
      </Modal>
    </>
  );
};

export default Reviews;
