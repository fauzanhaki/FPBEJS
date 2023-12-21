const express = require("express"),
  router = express.Router(),
  checkToken = require("../middleware/checkToken"),
  checkRole = require("../middleware/check.role"),
  controllers = require("../controller/review.controllers");

const Roles = {
  ADMIN: "admin",
  MENTOR: "mentor",
};

router.post("/create-review", checkToken, controllers.createReview);

router.get("/all-reviews", controllers.getAllReview);

router.get("/review-course/:id", controllers.getById);
router.put("/update-review/:id", checkToken, controllers.updateReview);

router.delete(
  "/delete-review/:id",
  checkToken,
  controllers.destroy
);

module.exports = router;
