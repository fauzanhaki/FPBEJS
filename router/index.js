const express = require('express'),
    router = express.Router(),
    categoryRouter = require('./categoryRouter')
    
    


router.use('/category', categoryRouter);


module.exports = router