const express = require('express'),
    router = express.Router(),
    checkToken = require("../middleware/checkToken"),
    checkRole = require("../middleware/check.role"),
    unverifiedUser = require('../middleware/unveifiedUser')
    controller = require("../controller/authController");

router.post('/login', controller.login);
router.post("/register", controller.register);
router.post("/send-otp", checkToken, controller.sendOTP);
router.post("/verify-otp", checkToken, unverifiedUser, controller.verifyOtp),
router.post("/forgot-password", controller.forgotPassword),
router.post("/reset-password", controller.resetPassword),
router.get("/me", checkToken, unverifiedUser, controller.me);

module.exports = router;