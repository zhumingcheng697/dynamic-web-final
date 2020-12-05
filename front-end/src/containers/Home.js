import React from "react";
import { useHistory } from "react-router-dom";

function Home() {
  const history = useHistory();

  return (
    <section className="SpacedSection FormSection">
      <form
        className="Form"
        onSubmit={(e) => {
          e.preventDefault();
          history.push(`/class/${e.currentTarget["class-code"].value}`);
        }}
      >
        <label htmlFor="class-code">
          <h2>Type in a class code to start</h2>
        </label>
        <p className="FormDescription">
          Please type in the format of DM-UY 3193, EXPOS UA 1, CSUY 1134, etc.
        </p>
        <input
          type="text"
          name="class-code"
          id="class-code"
          pattern="^([A-Za-z][A-Za-z0-9]+?)(-|\s)*([A-Za-z]{2}|((S|s)(H|h)(U|u)))(-|\s)*([0-9]+[0-9A-Za-z]*)$"
          autoCorrect="off"
          autoCapitalize="characters"
        />

        <button type="submit">Search</button>
      </form>
    </section>
  );
}

export default Home;
