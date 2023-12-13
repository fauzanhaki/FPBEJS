const router = require("./router"),
  schema = require("../validation/auth.schema.temp"),
  validate = require("../middlewares/validation"),
  { verifyToken } = require("../middlewares/verify.token.temp"),
  checkRole = require("../middlewares/checkRole"),
  authController = require("../controllers/auth.controller/index");

/* AUTH Route */
router.post("/register", authController.register);
router.post("/login", validate(schema.login), authController.login);
//user role
router.get("/me", verifyToken, checkRole.authPage([3]), authController.me);
router.put("/me", verifyToken, checkRole.authPage([3]), authController.putUser);
router.put(
  "/me/change-password",
  verifyToken,
  checkRole.authPage([3]),
  authController.changePassword
);

module.exports = router;
