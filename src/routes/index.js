const express = require("express"),
  review = require("./course.route/review"),
  auth = require("./profile.route/auth.route"),
  paymnet = require("./transaction.route/payment.method"),
  transaction = require("./transaction.route/transaction"),
  role = require("./profile.route/roles"),
  category = require("./course.route/category"),
  profile = require("./profile.route/profile");
router = express.Router();

router.use(review);
router.use(auth);
router.use(paymnet);
router.use(transaction);
router.use(role);
router.use(profile);
router.use(category);

module.exports = router;
