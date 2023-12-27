const express = require('express'),
    router = express.Router(),
    controller = require('../controller/module.controllers')

router.post('/', controller.createModuleCourse);
router.get('/', controller.getModuleCourse);
router.get('/:id', controller.getModuleCourseById);
router.put('/:id', controller.updateModuleCourse);
router.delete('/:id', controller.deleteModuleCourse);

module.exports = router;