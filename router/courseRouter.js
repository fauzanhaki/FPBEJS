const express = require('express'),
    router = express.Router(),
    controller = require('../controller/courseController');

router.post('/create', controller.createCourse)
router.get('/', controller.getAllCourse)
router.get('/search', controller.searchCourse)
router.get('/getBy/:id', controller.getCourseById)
router.get('/pagination', controller.paginationCourse)
router.put('/:id', controller.updateCourseById)
router.delete('/:id', controller.deleteCourseById)
module.exports = router