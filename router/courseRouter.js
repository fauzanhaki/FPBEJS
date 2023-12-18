
const express = require('express'),
    router = express.Router(),
    checkToken = require('../middleware/checkToken'),
    controller = require('../controller/courseController')

router.post('/create', checkToken, controller.createCourse)
router.get('/', controller.getAllCourse)
router.get('/:id', controller.getCourseById)
router.put('/:id', checkToken, controller.updateCourseById)
router.delete('/:id', checkToken, controller.deleteCourseById)
module.exports = router