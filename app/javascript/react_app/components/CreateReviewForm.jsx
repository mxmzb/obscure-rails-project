import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { useFormik } from "formik";
import axios from "axios";
import { nanoid } from "nanoid";
import * as Yup from "yup";

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
        // this part is quite nice, because it will automatically update the
        // average rating, too (we're refetching the whole product by invalidating
        // here).
        queryClient.invalidateQueries(["product", productId]);
      },
    },
  );

  const { values, errors, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: {
      rating: undefined,
      text: "",
    },
    // let's disable validation on the fly, pnly show errors after form submission
    // this is a ux decision mainly (in the real world i'd want to a/b test this vs
    // on-the-fly validation, because i've seen good reasons for both approaches)
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: Yup.object().shape({
      rating: Yup.number()
        .required("Rating is required")
        .min(1, "Invalid rating")
        .max(5, "Invalid rating"),
      text: Yup.string()
        .min(5, "Text too short")
        .max(50, "Text too long")
        .required("Text required"),
    }),
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

      {Object.values(errors).length > 0 && (
        <div id="error_explanation">
          <p>There are errors in your review:</p>
          <ul>
            {Object.keys(errors).map((key) => (
              <li key={`review-err-${key}`}>{errors[key]}</li>
            ))}
          </ul>
        </div>
      )}

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
