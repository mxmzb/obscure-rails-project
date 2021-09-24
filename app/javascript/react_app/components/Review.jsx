const Review = ({ id, rating, text }) => (
  <div className="review flex items-center mb-4">
    <div className="flex mr-4">
      {[...Array(5)].map((e, i) => (
        <div
          className={`star box-content pr-1${i < rating ? " active" : ""}`}
          key={`${id}_star-${i}`}
        ></div>
      ))}
    </div>
    <div className="text-gray-500">
      <strong className="text-black font-bold">{rating}</strong>, {text}
    </div>
  </div>
);

export default Review;
