const express = require("express"),
  router = express.Router(),
  controllers = require("../../controllers/course.controllers/review.controllers"),
  validate = require("../../middlewares/validate"),
  schema = require("../../validatorSchemas/review.schema"),
  { verifyToken } = require("../../middlewares/verfy.token"),
  checkRole = require("../../middlewares/check.role");

router.post(
  "/review",
  verifyToken,
  validate(schema.review),
  controllers.createReview
);
router.get("/allReview", verifyToken, controllers.getAllReview);
router.get(
  "/reviews/:id",
  verifyToken,
  checkRole.authPage([1, 3]),
  controllers.getById
);
router.delete("/delete-review/:id", verifyToken, controllers.destroy);

module.exports = router;
