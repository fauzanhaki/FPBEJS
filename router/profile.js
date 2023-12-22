const express = require("express"),
  router = express.Router(),
  checkToken = require("../middleware/checkToken"),
  checkRole = require("../middleware/check.role"),
  controllers = require("../controller/profile.controllers");

const Roles = {
  ADMIN: "admin",
};

router.post("/create-profile", checkToken, controllers.create);

router.get(
  "/all-profiles",
  checkToken,
  checkRole.authPage([Roles.ADMIN]),
  controllers.getAll
);
router.get("/my-profile", checkToken, controllers.getById);

router.put("/update-my-profile", checkToken, controllers.update);

router.delete(
  "/delete-profile/:id",
  checkToken,
  checkRole.authPage([Roles.ADMIN]),
  controllers.destroy
);

module.exports = router;
