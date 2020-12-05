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
  const [allRatingsLoaded, setAllRatingsLoaded] = useState(false);

  useEffect(() => {
    setRedirect(null);
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
    if (!ratings.length && !allRatingsLoaded) {
      axios
        .get(
          `https://${process.env.REACT_APP_HEROKU_APP_NAME}.herokuapp.com/ratings/class/${classCode}`
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
  }, [classCode, ratings, allRatingsLoaded]);

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
