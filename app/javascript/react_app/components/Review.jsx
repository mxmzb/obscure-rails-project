import classNames from "classnames";

const Review = ({ id, rating, text }) => (
  <div className="review flex items-center mb-4">
    <div className="flex mr-4">
      {[...Array(10)].map((e, i) => (
        <div
          className={classNames("star box-content", {
            "star-left": i % 2 === 0,
            "star-right": i % 2 === 1,
            "pr-1": i % 2 === 1,
            active: i < Math.round(rating * 2),
          })}
          key={`${id}_star-${i}`}
        ></div>
      ))}
    </div>
    <div className="text-gray-500">
      <strong className="text-black font-bold">{rating.toFixed(1)}</strong>, {text}
    </div>
  </div>
);

export default Review;
