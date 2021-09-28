# README

## Architectural decisions

#### 1. Client-side error validation

While in the vanilla JS branch I embedded the errors (if any) from the response, in this branch I've decided to just do the validation client-side ([with Yup](https://formik.org/docs/guides/validation#validationschema)). In this specific app case I also really think this is the better approach (because it's 1. simpler and more fitting for the simpe form with just rating and text and 2. faster as it doesn't need to wait for the server), but sometimes you need the database to validate forms, in which cases you obviously need to validate server-side.

#### 2. State-management in React

We're essentially just using `react-query` and [updating the API response](https://react-query.tanstack.com/guides/updates-from-mutation-responses) as we perform actions (e.g. creating a new review). Redux or another full-blown state management solution would be clearly overblown for our needs. I initially considered just using React Context or [Zustand](https://github.com/pmndrs/zustand) to share state across the app, but ended up just using Props and simple `useState()` to keep track of state unrelated to backend (e.g. modal state).

#### 3. Migrating from 5-full-star reviews to 5-half-star reviews

This is an interesting exercise. I see mainly three approaches to go for here:

##### 1. Approach: We can view this as a 10-point rating system

Meaning that 1 represents 0.5 star, 2 represents 1 full star, ..., 9 represents 4.5 stars, and 10 represents 5 stars.

The migration here is to take all the existing reviews in the database and 2x their rating values.

##### 2. Approach: We can view this as a 5-point-range rating system

Meaning that we'll save 0.5 floats for half-star ratings (and fundamentally there could be an unlimited amount of different rating values, but we'll only allow .0 and .5 values by offering the user the limited rating system and validating )

The migration here is to essentially just change the model / db schema for `review.rating` from integer to float.

##### 3. Approach: We can view this as a mixed system (both 5- and 10-points)

Meaning that we mark already existing reviews with a flag that indicates it is a 5-points review (e.g. `review.rating_type = '5-points'`) or that it is a 10-points review (e.g. `review.rating_type = '10-points'`). We then need to treat those review types differently in the frontend / backend.

###### The choice we make

In this particular case, I think approach 1. and 2. are fairly similar and good. Approach 3. is not favorible, but may become more favorible if the data that we're working with is difficult (or maybe even impossible) to transform homogenously (normalize) into a new data format.

Ultimately, I will be going for approach 2., mainly because I feel like I can save a few lines of code on it (e.g. I just need to change the field type from int to float, and can avoid multiplying every value by 2) and because it is probably a little less work to adjust already existing tests to the floating 5-points rating system.

## Testing

`bundle exec rspec`

**Important:** Development and test process both use the same host and port (localhost:3000), so you can run only either dev or tests at a time. The reason for this is because it's a quick fix (otherwise we need to pass the new host + port from the test env to the React component that connects to the cable).

You also need to have Redis running on your machine to run the tests.

All the useful tests are in [`spec/features/reviews_spec.rb`](spec/features/reviews_spec.rb).
