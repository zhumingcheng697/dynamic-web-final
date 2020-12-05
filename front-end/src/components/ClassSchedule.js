import React from "react";

function SectionSchedule({ section }) {
  return section ? (
    <div className="SectionSchedule">
      <h4>
        {section.section && !section.section.toLowerCase().includes("section")
          ? "Section "
          : ""}
        {section.section}
      </h4>
      <p>{section.days || "Days N/A"}</p>
      <p>{section.time || "Time N/A"}</p>
      <p>{section.instructor || "Instructor N/A"}</p>
    </div>
  ) : null;
}

function ClassSchedule({ schedule }) {
  return schedule && schedule.length ? (
    <>
      <h3>Offerings next semester</h3>
      <div className="ClassSchedule">
        {schedule.map((section, i) => {
          return <SectionSchedule section={section} key={i} />;
        })}
      </div>
    </>
  ) : (
    <h3>Not offered next semester</h3>
  );
}

export default ClassSchedule;
