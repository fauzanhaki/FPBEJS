const express = require('express'),
    router = express.Router();
const { changeUser, getAllUser, getUserById, deleteUser } = require('../controller/userController');

router.put('/:id', changeUser);
router.get('/', getAllUser);
router.get('/:id', getUserById);
router.delete('/:id', deleteUser);

module.exports = router;