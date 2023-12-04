const express = require("express"),
  review = require("./course.route/review"),
  auth = require("./profile.route/auth.route"),
  router = express.Router();

router.use(review);
router.use(auth);

module.exports = router;
