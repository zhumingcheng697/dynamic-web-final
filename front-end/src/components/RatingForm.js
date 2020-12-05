import React, { useState } from "react";
import axios from "axios";

function RatingForm({
  user,
  rating,
  setRating,
  setNewRatings,
  classCode,
  setIsPresented,
}) {
  const [editRes, setEditRes] = useState(null);

  return (
    <div className="RatingModal">
      <div
        className="RatingMask"
        onClick={() => {
          if (setIsPresented) {
            setIsPresented(false);
          }
        }}
      ></div>
      <div className="Scrollable">
        <div className="RatingWrapper">
          <div className="Doc">
            {editRes === 0 ||
            (typeof editRes === "string" && editRes !== "1") ? (
              <h3 className="Success">
                You have
                {rating && Object.keys(rating).length
                  ? " updated your "
                  : " posted this "}
                rating successfully.
              </h3>
            ) : editRes ? (
              <h3 className="Error">Oops. Something went wrong.</h3>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  const info = e.currentTarget;

                  axios
                    .get(
                      `https://${
                        process.env.REACT_APP_HEROKU_APP_NAME
                      }.herokuapp.com/${
                        rating && Object.keys(rating).length ? "edit" : "post"
                      }/${
                        rating && Object.keys(rating).length
                          ? rating.id
                          : classCode
                      }/?enjoyment=${info.enjoyment.value}&difficulty=${
                        info.difficulty.value
                      }&work=${info.work.value}&value=${
                        info.value.value
                      }&comment=${info.comment.value}${
                        rating
                          ? ""
                          : `&uid=${user.uid}&instructor=${info.instructor.value}`
                      }`
                    )
                    .then((res) => {
                      setEditRes(res.data);
                      if (
                        res.data !== 0 &&
                        !(typeof res.data === "string" && res.data !== "1")
                      ) {
                        console.error(res.data);
                        setTimeout(() => {
                          setEditRes(null);
                        }, 3000);
                      } else {
                        setTimeout(() => {
                          setEditRes({});

                          if (rating && Object.keys(rating).length) {
                            setRating((pRating) => {
                              return Object.assign({}, pRating, {
                                updatedAt: Date.now(),
                                enjoyment: parseInt(info.enjoyment.value),
                                value: parseInt(info.value.value),
                                work: parseInt(info.work.value),
                                difficulty: parseInt(info.difficulty.value),
                                comment: info.comment.value,
                              });
                            });
                          } else {
                            setNewRatings((pRatings) => {
                              return [
                                {
                                  postedAt: Date.now(),
                                  enjoyment: parseInt(info.enjoyment.value),
                                  value: parseInt(info.value.value),
                                  work: parseInt(info.work.value),
                                  difficulty: parseInt(info.difficulty.value),
                                  comment: info.comment.value,
                                  instructor: info.instructor.value,
                                  uid: user.uid,
                                  id: res.data,
                                },
                              ].concat(pRatings);
                            });
                          }
                          setIsPresented(false);
                        }, 3000);
                      }
                    })
                    .catch((err) => {
                      setEditRes(err);
                      console.error(err);
                      setTimeout(() => {
                        setEditRes(null);
                      }, 3000);
                    });
                }}
              >
                <h2>
                  {rating && Object.keys(rating).length
                    ? "Edit Rating"
                    : "New Rating"}
                </h2>
                <span
                  className="CloseBtn"
                  onClick={() => {
                    if (setIsPresented) {
                      setIsPresented(false);
                    }
                  }}
                >
                  ×
                </span>

                <h4 className="Required Text">
                  Do you enjoy taking this class?
                </h4>
                <div className="DocOptions">
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="e-1"
                      name="enjoyment"
                      value="1"
                      defaultChecked={rating && rating.enjoyment === 1}
                      required
                    />
                    <label htmlFor="e-1">Really dislike</label>
                  </div>
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="e-2"
                      name="enjoyment"
                      value="2"
                      defaultChecked={rating && rating.enjoyment === 2}
                      required
                    />
                    <label htmlFor="e-2">Somewhat dislike</label>
                  </div>
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="e-3"
                      name="enjoyment"
                      value="3"
                      defaultChecked={rating && rating.enjoyment === 3}
                      required
                    />
                    <label htmlFor="e-3">Neutral</label>
                  </div>
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="e-4"
                      name="enjoyment"
                      value="4"
                      defaultChecked={rating && rating.enjoyment === 4}
                      required
                    />
                    <label htmlFor="e-4">Somewhat enjoy</label>
                  </div>
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="e-5"
                      name="enjoyment"
                      value="5"
                      defaultChecked={rating && rating.enjoyment === 5}
                      required
                    />
                    <label htmlFor="e-5">Really enjoy</label>
                  </div>
                </div>

                <h4 className="Required">How difficult is this class?</h4>
                <div className="DocOptions">
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="d-1"
                      name="difficulty"
                      value="1"
                      defaultChecked={rating && rating.difficulty === 1}
                      required
                    />
                    <label htmlFor="d-1">Really easy</label>
                  </div>
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="d-2"
                      name="difficulty"
                      value="2"
                      defaultChecked={rating && rating.difficulty === 2}
                      required
                    />
                    <label htmlFor="d-2">Somewhat easy</label>
                  </div>
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="d-3"
                      name="difficulty"
                      value="3"
                      defaultChecked={rating && rating.difficulty === 3}
                      required
                    />
                    <label htmlFor="d-3">Neutral</label>
                  </div>
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="d-4"
                      name="difficulty"
                      value="4"
                      defaultChecked={rating && rating.difficulty === 4}
                      required
                    />
                    <label htmlFor="d-4">Somewhat difficult</label>
                  </div>
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="d-5"
                      name="difficulty"
                      value="5"
                      defaultChecked={rating && rating.difficulty === 5}
                      required
                    />
                    <label htmlFor="d-5">Really difficult</label>
                  </div>
                </div>

                <h4 className="Required">
                  How much work does this class require?
                </h4>
                <div className="DocOptions">
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="w-1"
                      name="work"
                      value="1"
                      defaultChecked={rating && rating.work === 1}
                      required
                    />
                    <label htmlFor="w-1">Close to none</label>
                  </div>
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="w-2"
                      name="work"
                      value="2"
                      defaultChecked={rating && rating.work === 2}
                      required
                    />
                    <label htmlFor="w-2">A little</label>
                  </div>
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="w-3"
                      name="work"
                      value="3"
                      defaultChecked={rating && rating.work === 3}
                      required
                    />
                    <label htmlFor="w-3">Somewhat</label>
                  </div>
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="w-4"
                      name="work"
                      value="4"
                      defaultChecked={rating && rating.work === 4}
                      required
                    />
                    <label htmlFor="w-4">Quite a bit</label>
                  </div>
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="w-5"
                      name="work"
                      value="5"
                      defaultChecked={rating && rating.work === 5}
                      required
                    />
                    <label htmlFor="w-5">A great deal</label>
                  </div>
                </div>

                <h4 className="Required">
                  How much value has this class added to your education?
                </h4>
                <div className="DocOptions">
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="v-1"
                      name="value"
                      value="1"
                      defaultChecked={rating && rating.value === 1}
                      required
                    />
                    <label htmlFor="v-1">Close to none</label>
                  </div>
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="v-2"
                      name="value"
                      value="2"
                      defaultChecked={rating && rating.value === 2}
                      required
                    />
                    <label htmlFor="v-2">A little</label>
                  </div>
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="v-3"
                      name="value"
                      value="3"
                      defaultChecked={rating && rating.value === 3}
                      required
                    />
                    <label htmlFor="v-3">Somewhat</label>
                  </div>
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="v-4"
                      name="value"
                      value="4"
                      defaultChecked={rating && rating.value === 4}
                      required
                    />
                    <label htmlFor="v-4">Quite a bit</label>
                  </div>
                  <div className="DocOption">
                    <input
                      type="radio"
                      id="v-5"
                      name="value"
                      value="5"
                      defaultChecked={rating && rating.value === 5}
                      required
                    />
                    <label htmlFor="v-5">A great deal</label>
                  </div>
                </div>

                {rating && Object.keys(rating).length ? null : (
                  <>
                    <label htmlFor="instructor">
                      <h4 className="Required">Your instructor:</h4>
                    </label>
                    <input
                      type="text"
                      id="instructor"
                      name="instructor"
                      defaultValue={rating && rating.instructor}
                      required
                    />
                  </>
                )}

                <label htmlFor="comment">
                  <h4>Comment:</h4>
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  defaultValue={rating && rating.comment}
                  placeholder="Optional"
                />

                <button type="submit">
                  {rating && Object.keys(rating).length ? "Update" : "Post"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (setIsPresented) {
                      setIsPresented(false);
                    }
                  }}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RatingForm;
