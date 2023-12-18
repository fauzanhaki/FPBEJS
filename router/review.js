const express = require("express"),
  router = express.Router(),
  checkToken = require("../middleware/checkToken"),
  checkRole = require("../middleware/check.role"),
  controllers = require("../controller/review.controllers");

const Roles = {
  ADMIN: "admin",
  MENTOR: "mentor",
};

router.post("/review", checkToken, controllers.createReview);

router.get("/allReview", controllers.getAllReview);

router.get("/reviews/:id", controllers.getById);

router.delete(
  "/delete-review/:id",
  checkToken,
  checkRole.authPage([Roles.ADMIN]),
  controllers.destroy
);

module.exports = router;
