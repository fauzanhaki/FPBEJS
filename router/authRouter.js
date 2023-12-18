const express = require("express"),
  router = express.Router(),
  checkToken = require("../middleware/checkToken"),
  checkRole = require("../middleware/check.role"),
  controller = require("../controller/authController");

const Roles = {
  ADMIN: "admin",
  MENTOR: "mentor",
};

router.post("/login", controller.login);

router.post("/register-user", controller.createUser);

router.post(
  "/register-admin",
  checkToken,
  checkRole.authPage([Roles.ADMIN]),
  controller.createAdmin
);

router.get("/me", checkToken, controller.me);

module.exports = router;
