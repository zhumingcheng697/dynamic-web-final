import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import ClassInfo from "../components/ClassInfo";
import ClassSchedule from "../components/ClassSchedule";
import { RatingByClass } from "../components/Rating";
import RatingForm from "../components/RatingForm";

function ClassPage({ user, setRedirect }) {
  const history = useHistory();
  const { classCode } = useParams();
  const [classData, setClassData] = useState({});
  const [ratings, setRatings] = useState([]);
  const [posting, setPosting] = useState(false);
  const [newRatings, setNewRatings] = useState([]);
  const [loadingRating, setLoadingRating] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(true);
  const [allRatingsLoaded, setAllRatingsLoaded] = useState(false);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollBottom =
        document.documentElement.scrollHeight -
        window.innerHeight -
        document.documentElement.scrollTop;

      if (scrollBottom < 1) {
        setShouldLoad(true);
      }
    });
  }, []);

  useEffect(() => {
    setRedirect((redirect) => {
      return redirect === null ? redirect : null;
    });
  }, [setRedirect]);

  useEffect(() => {
    if (classData && !Object.keys(classData).length) {
      axios
        .get(
          `https://${process.env.REACT_APP_HEROKU_APP_NAME}.herokuapp.com/class/${classCode}`
        )
        .then((res) => {
          setClassData(
            res.data && res.data.classInfo && res.data.classInfo.name
              ? res.data
              : null
          );
          if (!(res.data && res.data.classInfo && res.data.classInfo.name)) {
            setTimeout(() => {
              history.push("/");
            }, 3000);
          }
        })
        .catch((e) => {
          console.error(e);
          setClassData(null);
          setTimeout(() => {
            history.push("/");
          }, 3000);
        });
    }
  }, [user, classCode, classData, history]);

  useEffect(() => {
    setShouldLoad(false);

    if (!allRatingsLoaded && shouldLoad && !loadingRating) {
      setLoadingRating(true);

      const millis = ratings.length
        ? ratings[ratings.length - 1].postedAt
        : Date.now();

      axios
        .get(
          `https://${process.env.REACT_APP_HEROKU_APP_NAME}.herokuapp.com/ratings/class/${classCode}?maxAmount=${process.env.REACT_APP_RATINGS_LOAD_MAX}&beforeMillis=${millis}`
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
          setLoadingRating(false);
        });
    }
  }, [classCode, ratings, allRatingsLoaded, shouldLoad, loadingRating]);

  if (classData === null) {
    return (
      <div className="Centered">
        <h2>Unable to load class information</h2>
      </div>
    );
  }

  return (!classData || Object.keys(classData).length) &&
    (ratings.length || allRatingsLoaded) ? (
    <>
      <ClassInfo
        classInfo={classData.classInfo}
        subjectInfo={classData.subjectInfo}
      />

      <section className="SpacedSection">
        <ClassSchedule schedule={classData.classInfo.schedule} />
      </section>

      {posting ? (
        <RatingForm
          user={user}
          setNewRatings={setNewRatings}
          setIsPresented={setPosting}
          classCode={`${classData.classInfo.subjectCode}-
              ${classData.classInfo.schoolCode} ${classData.classInfo.classNumber}`}
        />
      ) : null}

      <section className="SpacedSection">
        {ratings.length || newRatings.length ? (
          <>
            <h3>
              Rating{ratings.length + newRatings.length === 1 ? "" : "s"} for{" "}
              {classData.classInfo.subjectCode}-{classData.classInfo.schoolCode}{" "}
              {classData.classInfo.classNumber}
            </h3>

            {user &&
            (newRatings.find((el) => el.uid === user.uid) ||
              ratings.find((el) => el.uid === user.uid)) ? (
              <button type="button" disabled={true}>
                You have already posted an rating for this class
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (user) {
                    setPosting(true);
                  } else {
                    setRedirect(classCode);
                    history.push("/sign-in");
                  }
                }}
              >
                {user ? "Rate this class" : "Sign in to rate this class"}
              </button>
            )}

            {newRatings.map((rating, i) =>
              rating.id ? (
                <RatingByClass
                  key={rating.id}
                  user={user}
                  rating={rating}
                  ratings={newRatings}
                  setRatings={setNewRatings}
                  index={i}
                />
              ) : null
            )}

            {ratings.map((rating, i) =>
              rating.id ? (
                <RatingByClass
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
                disabled={!!loadingRating}
                onClick={() => {
                  setShouldLoad(true);
                }}
              >
                {loadingRating ? "Loading..." : "Load More"}
              </button>
            )}
          </>
        ) : (
          <>
            <h3>No ratings available yet</h3>
            <button
              type="button"
              onClick={() => {
                if (user) {
                  setPosting(true);
                } else {
                  setRedirect(classCode);
                  history.push("/sign-in");
                }
              }}
            >
              {user
                ? "Become the first to rate this class"
                : "Sign in to become the first to rate this class"}
            </button>
          </>
        )}
      </section>
    </>
  ) : (
    <div className="Centered">
      <h2>Loading...</h2>
    </div>
  );
}

export default ClassPage;
