const express = require('express'),
    router = express.Router(),
    controller = require('../controller/authController')

router.post('/login', controller.login)

module.exports = router;