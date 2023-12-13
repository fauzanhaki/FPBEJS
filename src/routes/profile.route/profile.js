// routes/index.js
const express = require("express"),
  router = express.Router(),
  controllers = require("../../controllers/profile.controllers/profile.controllers"),
  // validate = require("../../middlewares/validate"),
  // schema = require("../../validatorSchemas/profile.schema"),
  { verifyToken } = require("../../middlewares/verfy.token"),
  checkRole = require("../../middlewares/check.role");

router.post("/create-profiles", controllers.create);
router.get(
  "/all-profiles",
  verifyToken,
  checkRole.authPage([1, 3]),
  controllers.getAll
);
router.get("/my-profile", verifyToken, controllers.getById);

router.put("/update-my-profile", verifyToken, controllers.update);
router.delete(
  "/delete-profile/:id",
  verifyToken,
  checkRole.authPage([1, 3]),
  controllers.destroy
);

module.exports = router;
