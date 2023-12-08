const express = require('express'),
    router = express.Router(),
    controller = require('../controller/categoryController');

router.post('/create', controller.create);
router.put('/:id', controller.update);
router.get('/', controller.get);
router.get('/:id', controller.getById);
router.delete('/:id', controller.destroy);

module.exports = router