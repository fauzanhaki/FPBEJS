const express = require("express"),
  router = express.Router(),
  controllers = require("../../controllers/course.controllers/review"),
  schema = require("../../validation/review.schema");

router.post("/review", controllers.createReview);
router.get("/allReview", controllers.getAllReview);
router.get("/reviews/:id", controllers.getById);

module.exports = router;
