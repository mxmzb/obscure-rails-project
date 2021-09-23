import React from "react";
import { useMutation } from "react-query";
import { useFormik } from "formik";
import axios from "axios";

const CreateReviewForm = ({ productId, onSubmit = () => {} }) => {
  const [ratingHoverValue, setRatingHoverValue] = React.useState();

  const mutation = useMutation((newReview) =>
    axios.post(`/products/${productId}/reviews.json`, newReview),
  );

  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      rating: undefined,
      text: "",
    },
    onSubmit: async (values) => {
      onSubmit(values);
      console.log(values);

      await mutation.mutate(values);
    },
  });

  const starIsActive = (starIndex) => {
    // there is a hover going on, so that's higher priority than the selected value
    if (ratingHoverValue !== undefined) {
      if (starIndex < ratingHoverValue) {
        return true;
      }
    }

    if (values.rating !== undefined && ratingHoverValue === undefined) {
      if (starIndex < values.rating) {
        return true;
      }
    }

    // default is not to show any stars as active
    return false;
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-5xl font-bold">What's your rating?</h2>
      <div className="h-8"></div>

      <h3 className="text-xl">Rating</h3>
      <div className="h-4"></div>
      <div className="flex">
        {[...Array(5)].map((e, i) => (
          <div
            className={`cursor-pointer star box-content pr-1${starIsActive(i) ? " active" : ""}`}
            key={`avg-rating_star-${i}`}
            onClick={() => setFieldValue("rating", i + 1)}
            onMouseOver={() => setRatingHoverValue(i + 1)}
            onMouseLeave={() => setRatingHoverValue(undefined)}
          ></div>
        ))}
      </div>

      <div className="h-8"></div>
      <h3 className="text-xl">Review</h3>
      <div className="h-4"></div>
      <input
        name="text"
        type="text"
        className="border-none focus:outline-none"
        placeholder="Start typing..."
        onChange={handleChange}
      />

      <div id="review-errors"></div>

      <div className="h-8"></div>
      <input
        type="submit"
        value="Submit review"
        className="cursor-pointer h-10 px-8 rounded bg-white text-gray-500 font-bold border border-gray-400 shadow"
      />
    </form>
  );
};

export default CreateReviewForm;
