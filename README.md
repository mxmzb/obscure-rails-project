# README

## Architectural decisions

#### 1. Client-side error validation

While in the vanilla JS branch I embedded the errors (if any) from the response, in this branch I've decided to just do the validation client-side ([with Yup](https://formik.org/docs/guides/validation#validationschema)). In this specific app case I also really think this is the better approach (because it's 1. simpler and more fitting for the simpe form with just rating and text and 2. faster as it doesn't need to wait for the server), but sometimes you need the database to validate forms, in which cases you obviously need to validate server-side.

## Testing

`bundle exec rspec`

**Important:** Development and test process both use the same host and port (localhost:3000), so you can run only either dev or tests at a time. The reason for this is because it's a quick fix (otherwise we need to pass the new host + port from the test env to the React component that connects to the cable).

All the useful tests are in [`spec/features/reviews_spec.rb`](spec/features/reviews_spec.rb).
