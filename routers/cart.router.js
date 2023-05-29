const express = require('express');
const router = express.Router();
const CartController = require('../controller/cart.controller');

router.post("/add", CartController.addToCart)
router.put("/update", CartController.updateCartItemQuantity)
router.delete("/delete/:user_id/:product_id", CartController.removeCartItem)
router.get("/detail/:userId", CartController.getCartDetails)

module.exports = router;