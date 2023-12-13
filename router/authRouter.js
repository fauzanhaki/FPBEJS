const express = require('express'),
    router = express.Router(),
    controller = require('../controller/authController')
// middleware = require('../middleware/checkToken')

router.post('/login', controller.login)

module.exports = router;