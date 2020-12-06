# [Rate My Classes](https://unruffled-bose-857315.netlify.app/)

**McCoy Zhu’s Final Project for Fall 2020 Dynamic Web App (DM-UY 3193)**

## Features

- Scrapes class information, class schedule, and subject information online using Puppeteer

- Post, edit, and delete ratings for classes

- Automatically generated rating summary for classes based on all previous ratings

- Custimizable username, option to display user’s major, and setting to hide email from others

- Allow users to post only 1 rating for each class

- Redirect user back to the class page that they left after sign-in / sign-up

- Redirect user to home page or profile page if class or user is not found

## [Front-End](https://unruffled-bose-857315.netlify.app/) Routes

- ### [`/`](https://unruffled-bose-857315.netlify.app/)

  Landing page where users can type in and search for classes

- ### [`/sign-in`](https://unruffled-bose-857315.netlify.app/sign-in)

  Sign-in page

- ### [`/sign-up`](https://unruffled-bose-857315.netlify.app/sign-up)

  Sign-up page

- ### [`/class/:classCode`](https://unruffled-bose-857315.netlify.app/class/DM-UY%203193)

  Class ratings page for class with class code `classCode`

  > Users will also be able to post, edit, and delete ratings on this page.

- ### [`/user`](https://unruffled-bose-857315.netlify.app/user)

  Profile page for the signed-in user

  > Users will also be able to edit and delete their previous ratings on this page.

- ### [`/user/:uid`](https://unruffled-bose-857315.netlify.app/user/KExgbP55G9aZqDpMSpIhERU87H52)

  Profile page for use with user id `uid`

- ### [`/update`](https://unruffled-bose-857315.netlify.app/update)

  Profile update page where the signed-in user can update their profile information

> Routing logic depending on whether the user has signed in or whether the search for a class or a user failed not detailed here.

## [Back-End](https://stark-basin-35300.herokuapp.com/) Endpoints

- ### [`/class/:classCode`](https://stark-basin-35300.herokuapp.com/class/DM-UY%203193)

  Get the information of the class with class code `classCode`

  > This is the only API that interfaces directly with Puppeteer. When this API is called, it first checks if a valid `classCode` is given through Regex and accessing the `subjectCatalog` collection on the database. If the `classCode` is valid, it then passes the subject information retreved from `subjectCatalog` and check if the class already exists in the `classes` collection on the database. If the class exists, the class information will be sent in the response along with the subject information. If the class does not exist, or if the class exists but is updated longer than 48 hours ago, the API will then attemp to scrape the latest class information using Puppeteer and updates the database using the latest information.

- ### [`/user/:uid`](https://stark-basin-35300.herokuapp.com/user/KExgbP55G9aZqDpMSpIhERU87H52)

  Get the information of the user with user id `uid`

- ### [`/rating/:id`](https://stark-basin-35300.herokuapp.com/rating/09fvEPSzf4XLdPdWie6y)

  Get the information of the rating with document id `id`

- ### [`/ratings/class/:classCode`](https://stark-basin-35300.herokuapp.com/ratings/class/DM-UY%203193)

  Get all the ratings for the class with class code `classCode`

- ### [`/ratings/user/:uid`](https://stark-basin-35300.herokuapp.com/ratings/user/KExgbP55G9aZqDpMSpIhERU87H52)

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

  Stores school codes, school names, and a catalog of subject codes and matching subject names scraped from [Albert](https://sis.nyu.edu).

- ### `users`

  **Document ID:** Firebase auth generated user id

  Stores user name, email, major, and preference for showing or hiding email for each user.

## Firestore Security Rules

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

- User documents under `users` collection can be accessed by the same user signed in with that account on the front end for sign up and profile update purposes.

- All documents can be accessed by the (pseudo) "admin" user signed in on the back end.

## Known Issues

- Back-end server may takes longer to boot up due to the big 400MB+ slug size (which is cause by having Puppeteer as a node dependency and having an extra [buildpack for Puppeteer](https://github.com/jontewks/puppeteer-heroku-buildpack))

  > To mitigate this issue, the front-end website now hits the back-end server every 10 minutues to keep the back end alive, but the boot time may still be significantly slower on the first visit after the tab is closed.

- If the information of a class has not been “cached” on the database, scraping that data on-demand can take up to a minute or so.

  > Because coursicle uses client-side rendering and often has content that only load on-demand, using conventional methods like `axios` and some HTML parser is not going to work, so I had to use Puppeteer.

- Editing and deleting ratings do not affect the overall rating of the class until you reload the page.

  > This can be fixed by having an extra read from the back end, which doesn’t seem necessary, or adding extra information to server’s response, which will also require some complicated computation logic on the front end and is not ideal.

- Deleting ratings is computationally expensive.

  > Because arrays and objects are reference types in JavaScript and React `useState` does not update views unless the reference of a reference type state variable is changed, deleting is implemented through array slicing and copying, which takes linear time.

- Error messages may not be as descriptive.

  > Because of the lack of knowledge of what kinds of errors Firebase may throw, only a general “Oops. Something went wrong.” error message will appear.
