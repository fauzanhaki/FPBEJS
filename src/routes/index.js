const express = require("express"),
  review = require("./course.route/review"),
  auth = require("./profile.route/auth.route"),
  paymnet = require("./transaction.route/payment.method"),
  transaction = require("./transaction.route/transaction"),
  router = express.Router();

router.use(review);
router.use(auth);
router.use(paymnet);
router.use(transaction);

module.exports = router;
