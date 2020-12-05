# Rate My Classes

**McCoy Zhu’s Final Project for Fall 2020 Dynamic Web App (DM-UY 3193)**

## Features

- Scrapes class information, class schedule, and subject information online using Puppeteer

- Post, edit, and delete ratings for classes

- Automatically generated rating summary for classes based on all previous ratings

- Custimizable username, option to display user’s major, and setting to hide email from others

- Allow users to post only 1 rating for each class

- Redirect user back to the class page that they left after sign-in / sign-up

- Redirect user to home page or profile page if class or user is not found

## Front-End Routes

- ### `/`

  Landing page where users can type in and search for classes

- ### `/sign-in`

  Sign-in page

- ### `/sign-up`

  Sign-up page

- ### `/class/:classCode`

  Class ratings page for class with class code `classCode`

  > Users will also be able to post, edit, and delete ratings on this page.

- ### `/user`

  Profile page for the signed-in user

  > Users will also be able to edit and delete previous ratings on this page.

- ### `/user/:uid`

  Profile page for use with user id `uid`

- ### `/update`

  Profile update page where the signed-in user can update their profile information

> Routing logic depending on whether the user has signed in or whether the search for a class or a user failed not detailed here.

## Back-End Endpoints

- ### `/class/:classCode`

  Get the information of the class with class code `classCode`

- ### `/user/:uid`

  Get the information of the user with user id `uid`

- ### `/rating/:id`

  Get the information of the rating with document id `id`

- ### `/ratings/class/:classCode`

  Get all the ratings for the class with class code `classCode`

- ### `/ratings/user/:uid`

  Get all the ratings from the user with user id `uid`

- ### `/post/:classCode`

  Post a rating for the class with class code `classCode`

- ### `/edit/:id`

  Edit a rating with document id `id`

- ### `/delete/:id`

  Delete a rating with document id `id`

> Detailed parameter and return type documentation are available as JSDoc in the back-end source codes.

## Firebase Collections

- ### `classes`

  **Document ID:** class code

  Stores class name, description, schedule, updated date, rating counts, and other information scraped online.

- ### `ratings`

  **Document ID:** randomized rating id

  Stores class code, rating, comment, user id, posted and updated date, and other rating information.

- ### `subjectCatalog`

  **Document ID:** school code

  Stores school codes, school names, and a catalog of subject codes and matching subject names.

- ### `users`

  **Document ID:** Firebase auth generated user id

  Stores user name, email, major, and preference for showing or hiding email for each user.

## Firestore Security Rules

- User documents under `users` collection can be accessed by the user signed in with that account on the front end for sign up and profile update purposes.

- All documents can be accessed by the (pseudo) "admin" user signed in on the back end.

```
match /databases/{database}/documents {
  match /{document=**} {
    allow read, write: if request.auth != null && request.auth.uid == <uid_of_pseudo_admin>;
  }

  match /users/{uid} {
    allow read, write: if request.auth != null && request.auth.uid == uid;
  }
}
```
