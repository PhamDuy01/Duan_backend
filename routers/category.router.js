const express = require('express');
const router = express.Router();
const CategoryController = require('../controller/category.controller');

router.post("/create", CategoryController.createCategory)
router.put("/update/:id", CategoryController.updateCategory)
router.delete("/delete/:id", CategoryController.deleteCategory)
router.get("/get-all", CategoryController.getAllCategories)

module.exports = router;