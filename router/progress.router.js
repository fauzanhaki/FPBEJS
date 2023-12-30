const express = require("express"),
  router = express.Router(),
  checkToken = require("../middleware/checkToken"),
  controllers = require("../controller/progres.controller");

  router.post('/send-progress', checkToken, controllers.sendProgress)

  module.exports = router;