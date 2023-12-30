const express = require('express'),
    router = express.Router(),
    controller = require('../controller/courseController'),
    checkToken = require('../middleware/checkToken')
    multer = require('multer')();

router.post('/create', multer.single('image'), controller.createCourse)
router.get('/', controller.getAllCourse)
router.get('/search', controller.searchCourse)
router.get('/getBy/:id', controller.getCourseById)
router.get('/pagination', controller.paginationCourse)
router.get('/my-course', checkToken, controller.myCourse)
router.put('/:id', multer.single('image'), controller.updateCourseById)
router.delete('/:id', controller.deleteCourseById)
module.exports = router