import "./App.css";

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import axios from "axios";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import ProfilePage from "./containers/ProfilePage";
import ClassPage from "./containers/ClassPage";
import SignUpPage from "./containers/SignUpPage";
import SignInPage from "./containers/SignInPage";
import UpdateUserProfilePage from "./containers/UpdateUserProfilePage";
import RatingForm from "./components/RatingForm";
import Header from "./components/Header";
import Home from "./containers/Home";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "dynamic-web-final-mz.firebaseapp.com",
  databaseURL: "https://dynamic-web-final-mz.firebaseio.com",
  projectId: "dynamic-web-final-mz",
  storageBucket: "dynamic-web-final-mz.appspot.com",
  messagingSenderId: "96292467053",
  appId: "1:96292467053:web:46d9d62a79f7fd96b76a64",
};

function App() {
  const [redirect, setRedirect] = useState(null);
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    firebase.auth().onAuthStateChanged((currUser) => {
      setUser(currUser);
      setUserLoaded(true);
    });

    axios
      .get(`https://${process.env.REACT_APP_HEROKU_APP_NAME}.herokuapp.com/`)
      .catch((err) => {
        console.error(err);
      });
  }, []);

  /**
   * Creates a new account
   *
   * @param {Event} e
   * @returns {Promise<number|Error>}
   */
  async function signUp(e) {
    try {
      e.preventDefault();

      const info = e.currentTarget;

      const credential = await firebase
        .auth()
        .createUserWithEmailAndPassword(
          info["email"].value,
          info["new-password"].value
        );

      await credential.user.updateProfile({
        displayName: info["username"].value,
      });

      await firebase
        .firestore()
        .collection("users")
        .doc(credential.user.uid)
        .set({
          displayName: info["username"].value,
          email: info["email"].value,
          hideEmail: info["hide-email"].checked,
          major: info["major"].value,
        });

      setUser(credential.user);

      return 0;
    } catch (err) {
      return err;
    }
  }

  /**
   * Logs a user in
   *
   * @param {Event} e
   * @returns {Promise<number|Error>}
   */
  async function signIn(e) {
    try {
      e.preventDefault();

      const info = e.currentTarget;

      const credential = await firebase
        .auth()
        .signInWithEmailAndPassword(
          info["email"].value,
          info["current-password"].value
        );

      setUser(credential.user);

      return 0;
    } catch (err) {
      return err;
    }
  }

  /**
   * Logs a user out
   *
   * @returns {Promise<number|Error>}
   */
  async function signOut() {
    try {
      await firebase.auth().signOut();

      setUser(null);

      return 0;
    } catch (err) {
      return err;
    }
  }

  /**
   * Edits the current user’s profile
   *
   * @param {Event} e
   * @returns {Promise<number|Error>}
   */
  async function updateUserProfile(e) {
    try {
      e.preventDefault();

      const info = e.currentTarget;

      await firebase
        .auth()
        .currentUser.updateProfile({ displayName: info["username"].value });

      await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .update({
          displayName: info["username"].value,
          hideEmail: info["hide-email"].checked,
          major: info["major"].value,
        });

      setUser(firebase.auth().currentUser);

      return 0;
    } catch (err) {
      return err;
    }
  }

  return !userLoaded ? null : (
    <>
      <Router>
        <Header user={user} signOut={signOut} />
        <div className="App">
          <Switch>
            <Route exact path="/(sign-up|signup)">
              {user ? (
                redirect ? (
                  <Redirect to={{ pathname: `/class/${redirect}` }} />
                ) : (
                  <Redirect to="/user" />
                )
              ) : (
                <SignUpPage signUp={signUp} />
              )}
            </Route>
            <Route exact path="/(sign-in|login|signin)">
              {user ? (
                redirect ? (
                  <Redirect to={{ pathname: `/class/${redirect}` }} />
                ) : (
                  <Redirect to="/user" />
                )
              ) : (
                <SignInPage signIn={signIn} />
              )}
            </Route>
            <Route exact path="/user">
              {user ? <ProfilePage user={user} /> : <Redirect to="/sign-in" />}
            </Route>
            <Route exact path="/user/:uid">
              <ProfilePage user={user} />
            </Route>
            <Route exact path="/update">
              {user ? (
                <UpdateUserProfilePage
                  user={user}
                  updateUserProfile={updateUserProfile}
                />
              ) : (
                <Redirect to="/sign-in" />
              )}
            </Route>
            <Route exact path="/class/:classCode">
              <ClassPage user={user} setRedirect={setRedirect} />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/">
              <Redirect to="/" />
            </Route>
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
