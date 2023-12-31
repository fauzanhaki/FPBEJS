const express = require("express"),
  router = express.Router(),
  checkToken = require("../middleware/checkToken"),
  checkRole = require("../middleware/check.role"),
  controllers = require("../controller/payment.method.controllers");

const Roles = {
  ADMIN: "admin",
  MENTOR: "mentor",
};

router.post(
  "/",
  checkToken,
  checkRole.authPage([Roles.ADMIN]),
  controllers.create
);

router.get("/", checkToken, controllers.getAll);

router.put(
  "/:id",
  checkToken,
  checkRole.authPage([Roles.ADMIN]),
  controllers.update
);

router.delete(
  "/:id",
  checkToken,
  checkRole.authPage([Roles.ADMIN]),
  controllers.destroy
);

module.exports = router;
