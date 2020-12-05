import React from "react";
import { Link } from "react-router-dom";

function Header({ user, signOut }) {
  return (
    <div className="Header">
      <h1>
        <Link to="/">Rate My Classes</Link>
      </h1>

      <nav>
        {user ? (
          <>
            <Link to="/user">{user.displayName}</Link>
            <Link to="/" onClick={signOut}>
              Sign Out
            </Link>
          </>
        ) : (
          <>
            <Link to="/sign-in">Sign In</Link>
            <Link to="/sign-up">Sign Up</Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default Header;
