const express = require("express"),
    router = express.Router(),
    controllers = require("../../controllers/transaction.controllers/transaction.controllers");

router.post("/transaction", controllers.create);
router.get("/all-transaction", controllers.getAll);
router.delete("/delete-transaction/:id", controllers.destroy);

module.exports = router;