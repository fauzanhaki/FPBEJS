const express = require("express"),
  router = express.Router(),
  categoryRouter = require("./categoryRouter"),
  authRouter = require("./authRouter"),
  courseRouter = require("./courseRouter"),
  review = require("./review"),
  payment = require("./payment.method"),
  profile = require("./profile"),
  transaction = require("./transaction");

router.use(authRouter);
router.use("/category", categoryRouter);
router.use("/course", courseRouter);
router.use(review);
router.use(profile);
router.use(payment);
router.use(transaction);

module.exports = router;
