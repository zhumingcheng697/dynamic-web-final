import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

function UpdateUserProfileForm({ user, updateUserProfile }) {
  const history = useHistory();
  const [userInfo, setUserInfo] = useState({});
  const [editRes, setEditRes] = useState(null);

  useEffect(() => {
    if (userInfo && !Object.keys(userInfo).length) {
      axios
        .get(
          `https://${process.env.REACT_APP_HEROKU_APP_NAME}.herokuapp.com/user/${user.uid}`
        )
        .then((res) => {
          setUserInfo(res.data && res.data.displayName ? res.data : null);
        })
        .catch((e) => {
          console.error(e);
          setUserInfo(null);
        });
    }
  }, [user, userInfo]);

  if (userInfo === null) {
    return <h3>Unable to load user information</h3>;
  }

  return (
    <>
      {!!editRes ? (
        <h4 className="Error">Oops. Something went wrong.</h4>
      ) : null}
      <form
        className="Form"
        onSubmit={(e) => {
          setEditRes(null);

          updateUserProfile(e)
            .then((res) => {
              if (res) {
                setEditRes(res);
                console.error(res);
                setTimeout(() => {
                  setEditRes(null);
                }, 3000);
              } else {
                history.push("/user");
              }
            })
            .catch((err) => {
              setEditRes(err);
              console.error(err);
              setTimeout(() => {
                setEditRes(null);
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
          defaultValue={userInfo.displayName}
          disabled={userInfo && !Object.keys(userInfo).length}
          required
        />

        <label htmlFor="major">Major</label>
        <input
          type="text"
          name="major"
          id="major"
          defaultValue={userInfo.major}
          disabled={userInfo && !Object.keys(userInfo).length}
          placeholder="Optional"
        />

        <div>
          <input
            type="checkbox"
            name="hide-email"
            id="hide-email"
            defaultChecked={userInfo.hideEmail}
            disabled={userInfo && !Object.keys(userInfo).length}
          />
          <label htmlFor="hide-email" className="FormDescription">
            Hide my email from other users
          </label>
        </div>

        <input
          type="submit"
          value="Update"
          disabled={userInfo && !Object.keys(userInfo).length}
        />
      </form>
    </>
  );
}

export default UpdateUserProfileForm;
