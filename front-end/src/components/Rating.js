import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import RatingRanks from "./RatingRanks";
import RatingForm from "./RatingForm";

function GenericRating({ user, rating, byUser, ratings, setRatings, index }) {
  const [delRes, setDelRes] = useState(null);
  const [editing, setEditing] = useState(null);
  const [ratingObj, setRating] = useState(rating);

  if (delRes !== null) {
    return (
      <div className="Rating">
        {delRes === 0 ? (
          <h4 className="Success">
            You have deleted this rating successfully.
          </h4>
        ) : (
          <h4 className="Error">Oops. Something went wrong.</h4>
        )}
      </div>
    );
  }

  return (
    <>
      {editing ? (
        <RatingForm
          user={user}
          classCode={ratingObj.classCode}
          rating={ratingObj}
          setRating={setRating}
          setIsPresented={setEditing}
        />
      ) : null}
      <div className="Rating">
        {byUser ? (
          <h4>{ratingObj.classCode}</h4>
        ) : (
          <h4 className="InstructorName">
            {ratingObj.instructor || "Instructor"}
          </h4>
        )}

        {ratingObj.enjoyment &&
        ratingObj.value &&
        ratingObj.difficulty &&
        ratingObj.work ? (
          <RatingRanks rating={ratingObj} />
        ) : null}

        {ratingObj.comment ? <p>{ratingObj.comment}</p> : null}

        <p className="RatingSmallText">
          Posted on{" "}
          {new Date(ratingObj.postedAt).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {ratingObj.updatedAt
            ? ` | Updated on ${new Date(ratingObj.updatedAt).toLocaleString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}`
            : ""}
        </p>

        <div className="RatingActions">
          {byUser ? (
            <Link to={`/class/${ratingObj.classCode}`}>
              <p className="RatingActionText">
                See other ratings posted for this class
              </p>
            </Link>
          ) : (
            <Link to={`/user/${ratingObj.uid}`}>
              <p className="RatingActionText">
                See other ratings posted by{" "}
                {user && user.uid === ratingObj.uid ? "me" : "this user"}
              </p>
            </Link>
          )}

          {user && user.uid === ratingObj.uid ? (
            <div className="Flex">
              <p
                className="RatingActionText"
                onClick={() => {
                  setEditing(true);
                }}
              >
                Edit
              </p>

              <p
                className="RatingActionText Destructive"
                onClick={() => {
                  axios
                    .get(
                      `https://${process.env.REACT_APP_HEROKU_APP_NAME}.herokuapp.com/delete/${ratingObj.id}`
                    )
                    .then((res) => {
                      setDelRes(res.data);
                      if (res.data) {
                        console.error(res.data);
                        setTimeout(() => {
                          setDelRes(null);
                        }, 3000);
                      } else {
                        setTimeout(() => {
                          if (setRatings) {
                            setRatings(
                              ratings
                                .slice(0, index)
                                .concat(ratings.slice(index + 1))
                            );
                          }
                        }, 3000);
                      }
                    })
                    .catch((err) => {
                      setDelRes(err);
                      console.error(err);
                      setTimeout(() => {
                        setDelRes(null);
                      }, 3000);
                    });
                }}
              >
                Delete
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

function RatingByClass({ user, rating, ratings, setRatings, index }) {
  return (
    <GenericRating
      user={user}
      rating={rating}
      byUser={false}
      ratings={ratings}
      setRatings={setRatings}
      index={index}
    />
  );
}

function RatingByUser({ user, rating, ratings, setRatings, index }) {
  return (
    <GenericRating
      user={user}
      rating={rating}
      byUser={true}
      ratings={ratings}
      setRatings={setRatings}
      index={index}
    />
  );
}

export { RatingByClass, RatingByUser };
