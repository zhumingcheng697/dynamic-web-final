import React from "react";
import UpdateUserProfileForm from "../components/UpdateUserProfileForm";

function UpdateUserProfilePage({ user, updateUserProfile }) {
  return (
    <section className="SpacedSection FormSection">
      <h2>Update Profile</h2>
      <UpdateUserProfileForm
        user={user}
        updateUserProfile={updateUserProfile}
      />
    </section>
  );
}

export default UpdateUserProfilePage;
