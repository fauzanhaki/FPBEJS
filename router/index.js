const express = require('express'),
    router = express.Router(),
    categoryRouter = require('./categoryRouter'),
    authRouter = require('./authRouter'),
    courseRouter = require('./courseRouter'),
    userRouter = require('./userRouter')
    
    

router.use(authRouter);
router.use('/category', categoryRouter);
router.use('/course', courseRouter);
router.use('/user', userRouter);

module.exports = router