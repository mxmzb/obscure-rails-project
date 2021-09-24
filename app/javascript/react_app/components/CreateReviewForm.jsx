import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useFormik } from "formik";
import axios from "axios";
import { nanoid } from "nanoid";

const CreateReviewForm = ({ productId, onSubmit = () => {} }) => {
  const [ratingHoverValue, setRatingHoverValue] = React.useState();

  // helpful resources: https://react-query.tanstack.com/guides/mutations
  // and https://react-query.tanstack.com/guides/optimistic-updates
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (newReview) => (await axios.post(`/products/${productId}/reviews.json`, newReview)).data,
    {
      onMutate: async (variables) => {
        await queryClient.cancelQueries(["product", productId]);
        const previousProduct = queryClient.getQueryData(["product", productId]);

        // nanoid just to generate unique id for the time being, as we need the server to
        // know what the real id of the new review is
        const optimisticReview = { id: nanoid(), text: variables.text, rating: variables.rating };

        queryClient.setQueryData(["product", productId], (old) => ({
          ...old,
          reviews: [optimisticReview, ...old.reviews],
        }));

        return { optimisticReview, previousProduct };
      },
      onSuccess: (result, variables, context) => {
        // Replace optimistic todo in the todos list with the result
        // so we get the real review id
        queryClient.setQueryData(["product", productId], (old) => ({
          ...old,
          reviews: old.reviews.map((review) =>
            review.id === context.optimisticReview.id ? result : review,
          ),
        }));
      },
      onError: (error, variables, context) => {
        // just reset the whole product back to what it was before
        queryClient.setQueryData(["product", productId], context.previousProduct);
      },
      onSettled: async (data, error, variables, context) => {
        queryClient.invalidateQueries(["product", productId]);
      },
    },
  );

  const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      rating: undefined,
      text: "",
    },
    onSubmit: async (values, { resetForm }) => {
      // this onSubmit is from props, and it is just a handler to close the modal
      onSubmit(values);
      resetForm();
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
        value={values.text}
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
