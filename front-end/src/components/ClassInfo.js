import React from "react";
import RatingRanks from "./RatingRanks";

function ClassInfo({ classInfo, subjectInfo }) {
  const rating = classInfo.ratingSummary;
  return (
    <section className="SpacedSection">
      <h2>
        {classInfo.name} ({classInfo.subjectCode}-{classInfo.schoolCode}{" "}
        {classInfo.classNumber})
      </h2>

      <RatingRanks rating={classInfo.ratingSummary} />

      {subjectInfo && subjectInfo.subjectName && subjectInfo.schoolName ? (
        <p>
          {subjectInfo.schoolName} | {subjectInfo.subjectName}
        </p>
      ) : null}

      {classInfo.description ? <p>{classInfo.description}</p> : null}

      {classInfo.credits ? <p>{classInfo.credits} Credits</p> : null}

      {classInfo["avg-sections"] ? (
        <p>
          {classInfo["avg-sections"]} Section
          {classInfo["avg-sections"] === "1" ? "" : "s"} per Semester on Average
        </p>
      ) : null}

      {classInfo["recent-semesters"] ? (
        <p>Offered in {classInfo["recent-semesters"]}</p>
      ) : (
        <p>Has not been offered in a while</p>
      )}

      {classInfo.updatedAt && Date(classInfo.updatedAt) ? (
        <p>
          Updated at{" "}
          {new Date(classInfo.updatedAt).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </p>
      ) : null}
    </section>
  );
}

export default ClassInfo;
