import React, { useState } from "react";

function SignUpForm({ signUp }) {
  const [signUpRes, setSignUpRes] = useState(null);

  return (
    <>
      {signUpRes ? (
        <h4 className="Error">Oops. Something went wrong.</h4>
      ) : null}
      <form
        className="Form"
        onSubmit={(e) => {
          setSignUpRes(null);

          signUp(e)
            .then((res) => {
              setSignUpRes(res);
              if (res) {
                console.error(res);
                setTimeout(() => {
                  setSignUpRes(null);
                }, 3000);
              }
            })
            .catch((err) => {
              setSignUpRes(err);
              console.error(err);
              setTimeout(() => {
                setSignUpRes(null);
              }, 3000);
            });
        }}
      >
        <label htmlFor="username" className="Required">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          autoComplete="username"
          required
        />

        <label htmlFor="email" className="Required">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          autoComplete="email"
          required
        />

        <label htmlFor="new-password" className="Required">
          Password
        </label>
        <input
          type="password"
          name="new-password"
          id="new-password"
          autoComplete="new-password"
          required
        />

        <label htmlFor="major">Major</label>
        <input type="text" name="major" id="major" placeholder="Optional" />

        <div>
          <input type="checkbox" name="hide-email" id="hide-email" />
          <label htmlFor="hide-email" className="FormDescription">
            Hide my email from other users
          </label>
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignUpForm;
