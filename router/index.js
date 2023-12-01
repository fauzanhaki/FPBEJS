const express = require('express'),
    router = express.Router(),
    categoryRouter = require('./categoryRouter'),
    authRouter = require('./authRouter'),
    courseRouter = require('./courseRouter')
    
    

router.use(authRouter);
router.use('/category', categoryRouter);
router.use('/course', courseRouter)

module.exports = router