import React from "react";
import { Link } from "react-router-dom";
import SignUpForm from "../components/SignUpForm";

function SignUpPage({ signUp }) {
  return (
    <section className="SpacedSection FormSection">
      <h2>Sign Up</h2>
      <SignUpForm signUp={signUp} />
      <Link to="/sign-in" className="Centered">
        Already have an account? Sign in
      </Link>
    </section>
  );
}

export default SignUpPage;
