import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";

import { RatingByUser } from "../components/Rating";

function ProfilePage({ user }) {
  const history = useHistory();
  const { uid } = useParams();
  const [userInfo, setUserInfo] = useState({});
  const [ratings, setRatings] = useState([]);
  const [allRatingsLoaded, setAllRatingsLoaded] = useState(false);

  useEffect(() => {
    if (userInfo && !Object.keys(userInfo).length) {
      axios
        .get(
          `https://${
            process.env.REACT_APP_HEROKU_APP_NAME
          }.herokuapp.com/user/${uid || user.uid}`
        )
        .then((res) => {
          setUserInfo(res.data && res.data.displayName ? res.data : null);
        })
        .catch((e) => {
          console.error(e);
          setUserInfo(null);
        });
    }
  }, [user, uid, userInfo]);

  useEffect(() => {
    if (!ratings.length && !allRatingsLoaded) {
      axios
        .get(
          `https://${
            process.env.REACT_APP_HEROKU_APP_NAME
          }.herokuapp.com/ratings/user/${uid || user.uid}`
        )
        .then((res) => {
          if (!res.data.length) {
            setAllRatingsLoaded(true);
          }
          setRatings((ratings) => ratings.concat(res.data));
        })
        .catch((e) => {
          console.error(e);
          setAllRatingsLoaded(true);
        });
    }
  }, [user, uid, allRatingsLoaded, ratings]);

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
          <input
            type="button"
            value="Update Profile"
            onClick={() => {
              history.push("/update");
            }}
          />
        ) : null}
      </section>

      <section className="SpacedSection">
        {ratings.length ? (
          <>
            <h3>
              {!uid || (user && uid === user.uid)
                ? "Ratings you posted"
                : `Ratings from ${userInfo.displayName}`}
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
