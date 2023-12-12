
const express = require('express'),
    router = express.Router(),
    checkToken = require('../middleware/checkToken'),
    controller = require('../controller/courseController')

router.post('/create', controller.createCourse)
router.get('/', controller.getAllCourse)
router.get('/:id', controller.getCourseById)
router.put('/:id', controller.updateCourseById)
router.delete('/:id', controller.deleteCourseById)
module.exports = router