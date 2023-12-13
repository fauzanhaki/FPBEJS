const express = require("express"),
  router = express.Router(),
  controllers = require("../../controllers/transaction.controllers/payment.method.controllers");
// schema = require("../../validation/transaction.schema");

router.post("/payment-method", controllers.create);
router.get("/get-payment-method", controllers.getAll);
router.put("/update-payment-method/:id", controllers.update);
router.delete("/delete-payment-method/:id", controllers.destroy);

module.exports = router;
