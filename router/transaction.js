const express = require("express"),
  router = express.Router(),
  checkToken = require("../middleware/checkToken"),
  checkRole = require("../middleware/check.role"),
  controllers = require("../controller/transaction.controllers");

const Roles = {
  ADMIN: "admin",
  MENTOR: "mentor",
};

router.post("/transaction", checkToken, controllers.create);

router.get(
  "/all-transaction",
  checkToken,
  checkRole.authPage([Roles.ADMIN]),
  controllers.getAll
);

router.get("/my-transaction", checkToken, controllers.getById);

router.delete(
  "/delete-transaction/:id",
  checkToken,
  checkRole.authPage([Roles.ADMIN]),
  controllers.destroy
);

module.exports = router;
