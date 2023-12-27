const express = require('express'),
    router = express.Router(),
    categoryRouter = require('./categoryRouter'),
    authRouter = require('./authRouter'),
    courseRouter = require('./courseRouter'),
    userRouter = require('./userRouter'),
    profileRouter = require('./profile'),
    reviewRouter = require('./review'),
    transactionRouter = require('./transaction'),
    paymentMethod = require('./payment.method'),
    moduleRouter = require('./module.router')
    
    

router.use('/auth', authRouter);
router.use('/category', categoryRouter);
router.use('/course', courseRouter);
router.use('/user', userRouter);
router.use('/profile', profileRouter);
router.use('/review', reviewRouter);
router.use('/transaction', transactionRouter);
router.use('/payment-method', paymentMethod);
router.use('/module', moduleRouter);

module.exports = router