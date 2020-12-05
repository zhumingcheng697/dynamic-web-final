import React from "react";

function RatingRanks({ rating }) {
  return (
    <div className="Ranks">
      <p>
        <strong>Enjoyment: </strong>
        {rating.enjoyment ? `${rating.enjoyment.toFixed(1)} / 5.0` : "N/A"}
      </p>
      <p>
        <strong>Difficulty: </strong>
        {rating.difficulty ? `${rating.difficulty.toFixed(1)} / 5.0` : "N/A"}
      </p>
      <p>
        <strong>Work: </strong>
        {rating.work ? `${rating.work.toFixed(1)} / 5.0` : "N/A"}
      </p>
      <p>
        <strong>Value: </strong>
        {rating.value ? `${rating.value.toFixed(1)} / 5.0` : "N/A"}
      </p>
    </div>
  );
}

export default RatingRanks;
