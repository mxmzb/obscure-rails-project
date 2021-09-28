import classNames from "classnames";

const AverageRating = ({ value }) => (
  <div id="average-rating" className="flex">
    {!!value && (
      <>
        <div className="mr-4 text-xl">{value.toFixed(1)}</div>

        <div className="flex">
          {[...Array(10)].map((e, i) => (
            <div
              className={classNames("star box-content", {
                "star-left": i % 2 === 0,
                "star-right": i % 2 === 1,
                "pr-1": i % 2 === 1,
                active: i < Math.round(value * 2),
              })}
              key={`avg-rating_star-${i}`}
            ></div>
          ))}
        </div>
      </>
    )}

    {!value && <div className="mr-4 text-xl">No reviews yet</div>}
  </div>
);

export default AverageRating;
