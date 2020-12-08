import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

import { RatingByUser } from "../components/Rating";

function ProfilePage({ user }) {
  const history = useHistory();
  const { uid } = useParams();
  const [userInfo, setUserInfo] = useState({});
  const [ratings, setRatings] = useState([]);
  const [firstRatingsLoaded, setFirstRatingsLoaded] = useState(false);
  const [allRatingsLoaded, setAllRatingsLoaded] = useState(false);

  useEffect(() => {
    if (userInfo && !Object.keys(userInfo).length) {
      axios
        .get(
          `https://${
            process.env.REACT_APP_HEROKU_APP_NAME
          }.herokuapp.com/user/${uid || user.uid}?maxAmount=100`
        )
        .then((res) => {
          setUserInfo(res.data && res.data.displayName ? res.data : null);
          if (
            !(res.data && res.data.displayName) &&
            uid &&
            (!user || uid !== user.uid)
          ) {
            setTimeout(() => {
              history.push("/user");
              setUserInfo({});
              setRatings([]);
              setAllRatingsLoaded(false);
            }, 3000);
          }
        })
        .catch((e) => {
          console.error(e);
          setUserInfo(null);
          if (uid && (!user || uid !== user.uid)) {
            setTimeout(() => {
              history.push("/user");
              setUserInfo({});
              setRatings([]);
              setAllRatingsLoaded(false);
            }, 3000);
          }
        });
    }
  }, [user, uid, userInfo, history]);

  useEffect(() => {
    if (!ratings.length && !firstRatingsLoaded && !allRatingsLoaded) {
      axios
        .get(
          `https://${
            process.env.REACT_APP_HEROKU_APP_NAME
          }.herokuapp.com/ratings/user/${uid || user.uid}?maxAmount=${
            process.env.REACT_APP_RATINGS_LOAD_MAX
          }`
        )
        .then((res) => {
          if (
            res.data.length !== parseInt(process.env.REACT_APP_RATINGS_LOAD_MAX)
          ) {
            setAllRatingsLoaded(true);
          }
          setRatings((ratings) => ratings.concat(res.data));
        })
        .catch((e) => {
          console.error(e);
          setAllRatingsLoaded(true);
        })
        .finally(() => {
          setFirstRatingsLoaded(true);
        });
    }
  }, [user, uid, firstRatingsLoaded, allRatingsLoaded, ratings]);

  if (userInfo === null) {
    return (
      <div className="Centered">
        <h2>Unable to load user information</h2>
      </div>
    );
  }

  return (!userInfo || Object.keys(userInfo).length) &&
    (ratings.length || allRatingsLoaded) ? (
    <>
      <section className="SpacedSection">
        <h2>{userInfo.displayName}</h2>

        {userInfo.major ? <p>{userInfo.major}</p> : null}

        {userInfo.email || (user && typeof uid === "undefined") ? (
          <p>{userInfo.email || user.email}</p>
        ) : null}

        {uid && (!user || uid !== user.uid) && userInfo.hideEmail ? (
          <p>{userInfo.displayName} has hidden their email address.</p>
        ) : null}

        {!uid || (user && uid === user.uid) ? (
          <button
            type="button"
            onClick={() => {
              history.push("/update");
            }}
          >
            Update Profile
          </button>
        ) : null}
      </section>

      <section className="SpacedSection">
        {ratings.length ? (
          <>
            <h3>
              {!uid || (user && uid === user.uid)
                ? `Rating${ratings.length === 1 ? "" : "s"} you have posted`
                : `Rating${ratings.length === 1 ? "" : "s"} from ${
                    userInfo.displayName
                  }`}
            </h3>

            {ratings.map((rating, i) =>
              rating.id ? (
                <RatingByUser
                  key={rating.id}
                  user={user}
                  rating={rating}
                  ratings={ratings}
                  setRatings={setRatings}
                  index={i}
                />
              ) : null
            )}

            {allRatingsLoaded ? null : (
              <button
                className="Centered"
                type="button"
                onClick={() => {
                  const millis = ratings.length
                    ? ratings[ratings.length - 1].postedAt
                    : Date.now();

                  axios
                    .get(
                      `https://${
                        process.env.REACT_APP_HEROKU_APP_NAME
                      }.herokuapp.com/ratings/user/${
                        uid || user.uid
                      }?maxAmount=${
                        process.env.REACT_APP_RATINGS_LOAD_MAX
                      }&beforeMillis=${millis}`
                    )
                    .then((res) => {
                      if (
                        res.data.length !==
                        parseInt(process.env.REACT_APP_RATINGS_LOAD_MAX)
                      ) {
                        setAllRatingsLoaded(true);
                      }
                      setRatings((ratings) => ratings.concat(res.data));
                    })
                    .catch((e) => {
                      console.error(e);
                      setAllRatingsLoaded(true);
                    });
                }}
              >
                Load more ratings
              </button>
            )}
          </>
        ) : (
          <h3>
            {!uid || (user && uid === user.uid)
              ? "You have "
              : `${userInfo.displayName} has `}
            not posted any rating yet
          </h3>
        )}
      </section>
    </>
  ) : (
    <div className="Centered">
      <h2>Loading...</h2>
    </div>
  );
}

export default ProfilePage;
