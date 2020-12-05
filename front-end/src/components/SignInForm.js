import React, { useState } from "react";

function SignInForm({ signIn }) {
  const [signInRes, setSignInRes] = useState(null);

  return (
    <>
      {signInRes ? (
        <h4 className="Error">Oops. Something went wrong.</h4>
      ) : null}
      <form
        className="Form"
        onSubmit={(e) => {
          e.preventDefault();

          setSignInRes(null);

          signIn(e)
            .then((res) => {
              if (res) {
                setSignInRes(res);
                console.error(res);
                setTimeout(() => {
                  setSignInRes(null);
                }, 3000);
              }
            })
            .catch((err) => {
              setSignInRes(err);
              console.error(err);
            });
        }}
      >
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          autoComplete="email"
          required
        />

        <label htmlFor="current-password">Password</label>
        <input
          type="password"
          name="current-password"
          id="current-password"
          autoComplete="current-password"
          required
        />

        <button type="submit">Sign In</button>
      </form>
    </>
  );
}

export default SignInForm;
