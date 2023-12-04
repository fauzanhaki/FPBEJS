const express = require("express"),
  router = express.Router(),
  controller = require("../../controllers/profile.controllers/auth.controllers");
// middleware = require('../middleware/checkToken')

router.post("/login", controller.login);

module.exports = router;
