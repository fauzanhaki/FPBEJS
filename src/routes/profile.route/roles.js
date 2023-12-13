const express = require("express"),
  router = express.Router(),
  controllers = require("../../controllers/profile.controllers/role.controllers"),
  validate = require("../../middlewares/validate"),
  schema = require("../../validatorSchemas/profile.schema"),
  { verifyToken } = require("../../middlewares/verfy.token"),
  checkRole = require("../../middlewares/check.role");

router.post(
  "/role",
  verifyToken,
  checkRole.authPage([3]),
  validate(schema.role),
  controllers.create
);
router.get(
  "/get-all-role",
  verifyToken,
  checkRole.authPage([3]),
  controllers.getAll
);
router.put(
  "/update-role/:id",
  verifyToken,
  checkRole.authPage([3]),
  validate(schema.role),
  controllers.update
);
router.delete(
  "/delete-roles/:id",
  verifyToken,
  checkRole.authPage([3]),
  controllers.destroy
);

module.exports = router;
