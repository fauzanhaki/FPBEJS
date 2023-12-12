const express = require('express'),
    router = express.Router();
const { changeUser, getAllUser, getUserById, deleteUser } = require('../controller/userController');

router.put('/create', changeUser);
router.get('/', getAllUser);
router.get('/:id', getUserById);
router.delete('/', deleteUser);

module.exports = router;