const AverageRating = ({ value }) => (
  <div id="average-rating" className="flex">
    {!!value && (
      <>
        <div className="mr-4 text-xl">{value.toFixed(1)}</div>

        <div className="flex">
          {[...Array(5)].map((e, i) => (
            <div
              className={`star box-content pr-1${i < Math.round(value) ? " active" : ""}`}
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
