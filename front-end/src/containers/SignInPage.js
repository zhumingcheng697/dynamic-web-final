import React from "react";
import { Link } from "react-router-dom";
import SignInForm from "../components/SignInForm";

function SignInPage({ signIn }) {
  return (
    <section className="SpacedSection FormSection">
      <h2>Sign In</h2>
      <SignInForm signIn={signIn} />
      <Link to="/sign-up" className="Centered">
        Don’t have an account? Sign up today
      </Link>
    </section>
  );
}

export default SignInPage;
