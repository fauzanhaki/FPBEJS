
const express = require('express'),
    router = express.Router(),
    checkToken = require('../middleware/checkToken'),
    controller = require('../controller/courseController')

router.post('/create', checkToken, controller.createCourse)

module.exports = router