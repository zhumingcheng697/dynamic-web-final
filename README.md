# Rate My Classes

**McCoy Zhu’s Final Project for Fall 2020 Dynamic Web App (DM-UY 3193)**

## Features

- Scrapes class information, class schedule, and subject information online using Puppeteer

- Post, edit, and delete ratings for classes

- Automatically generated rating summary for classes based on all previous ratings

- Custimizable username, option to display user’s major, and setting to hide email from others

- Allow users to post only 1 rating for each class

- Redirect user back to the class page that they left after sign-in / sign-up

## Front-End Routes

### `/`

Landing page where users can type in and search for classes

### `/sign-in`

Sign-in page

### `/sign-up`

Sign-up page

### `/class/:classCode`

Class ratings page for class with class code `classCode`

### `/user`

Profile page for the signed-in user

### `/user/:uid`

Profile page for use with user id `uid`

### `/update`

Profile update page where the signed-in user can update their profile information

## API Endpoints

### `/class/:classCode`

Get the information of the class with class code `classCode`

### `/user/:uid`

Get the information of the user with user id `uid`

### `/rating/:id`

Get the information of the rating with document id `id`

### `/ratings/class/:classCode`

Get all the ratings for the class with class code `classCode`

### `/ratings/user/:uid`

Get all the ratings from the user with user id `uid`

### `/post/:classCode`

Post a rating for the class with class code `classCode`

### `/edit/:id`

Edit a rating with document id `id`

### `/delete/:id`

Delete a rating with document id `id`
