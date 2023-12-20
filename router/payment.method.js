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
  "/payment-method",
  checkToken,
  checkRole.authPage([Roles.ADMIN]),
  controllers.create
);

router.get("/get-payment-method", checkToken, controllers.getAll);

router.put(
  "/update-payment-method/:id",
  checkToken,
  checkRole.authPage([Roles.ADMIN]),
  controllers.update
);

router.delete(
  "/delete-payment-method/:id",
  checkToken,
  checkRole.authPage([Roles.ADMIN]),
  controllers.destroy
);

module.exports = router;
