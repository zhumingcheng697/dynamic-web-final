const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send(
    `
<h1>Endpoints</h1>

<strong><code>/class/:classCode</code></strong>
<p>Get the information of the class with class code <code>classCode</code></p>
</br>

<strong><code>/user/:uid</code></strong>
<p>Get the information of the user with user id <code>uid</code></p>
</br>

<strong><code>/rating/:id</code></strong>
<p>Get the information of the rating with document id <code>id</code></p>
</br>

<strong><code>/ratings/class/:classCode</code></strong>
<p>Get all the ratings for the class with class code <code>classCode</code></p>
</br>

<strong><code>/ratings/user/:uid</code></strong>
<p>Get all the ratings from the user with user id <code>uid</code></p>
</br>

<strong><code>/post/:classCode</code></strong>
<p>Post a rating for the class with class code <code>classCode</code></p>
</br>

<strong><code>/edit/:id</code></strong>
<p>Edit a rating with document id <code>id</code></p>
</br>

<strong><code>/delete/:id</code></strong>
<p>Delete a rating with document id <code>id</code></p>
</br>
`
  );
});

module.exports = router;
