import Review from "./Review";

const ReviewsList = ({ reviews = [] }) =>
  reviews.map((review) => <Review {...review} key={`review-${review.id}`} />);

export default ReviewsList;
