const express = require('express');
const router = express.Router();
const OrderController = require('../controller/order.controller');

router.post("/create", OrderController.createOrder)
router.get("/list", OrderController.getOrders)
router.get("/detail/:orderId", OrderController.getOrderDetails)

router.put("/on", OrderController.isPaid)
router.put("/off", OrderController.removePaid)

module.exports = router;