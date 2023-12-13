// Router
const express = require("express"),
  router = express.Router(),
  controller = require("../../controllers/profile.controllers/auth.controllers"),
  validate = require("../../middlewares/validate"),
  schema = require("../../validatorSchemas/profile.schema"),
  { verifyToken } = require("../../middlewares/verfy.token"), // Corrected import
  checkRole = require("../../middlewares/check.role");

router.post(
  "/register-user",
  validate(schema.registerUser),
  controller.createUser
);
router.post(
  "/register-admin",
  verifyToken,
  checkRole.authPage([3]),
  validate(schema.register),
  controller.create
);
router.post("/login", validate(schema.login), controller.login);
router.get("/me", verifyToken, controller.me);
router.put("/me/change-password", verifyToken, controller.changePassword);

router.post("/reset-password", controller.resetPassword);
router.post("/set-password", controller.setPassword);

router.post("/google-login", controller.googleLogin);
router.post("/reset-password", controller.resetPasswordgoogle);

module.exports = router;
