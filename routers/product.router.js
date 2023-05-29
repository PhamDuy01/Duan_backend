const express = require('express');
const router = express.Router();
const ProductController = require('../controller/product.controller');
const { uploadImage } = require("../middleware/multer.middleware")

router.post("/create", uploadImage, ProductController.addProduct)
router.put('/update/stock', ProductController.updateStock)
router.put("/update/:id", uploadImage, ProductController.updateProduct)
router.delete("/delete/:id", ProductController.deleteProduct)
router.get("/detail/:productId", ProductController.getProductDetails)
router.get("/get-all", ProductController.getAllProducts)

router.put('/on', ProductController.onState)
router.put('/off', ProductController.offState)

module.exports = router;