const Product = require('../model/product.model');
const uploadImage = require("../middleware/multer.middleware")
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Hàm thêm sản phẩm
const addProduct = async (req, res) => {
  const { name, description, category, price, stock } = req.body;

  const image = req.file.path;

  // Kiểm tra các trường bắt buộc
  if (!name || !description || !category || !price || !image || !stock) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const foundProduct = await Product.findOne({ name: name }).exec();
  if (foundProduct) {
    return res.status(400).json({ message: "Product already exists!" });
  }

  try {

    const newProduct = new Product({
      name,
      description,
      category,
      price,
      image,
      stock
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addProductWithImageUpload = [uploadImage, addProduct];

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Kiểm tra xem sản phẩm tồn tại trong cơ sở dữ liệu hay không
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Cập nhật thông tin sản phẩm
    const allowedFields = ['name', 'description', 'category', 'price', 'stock', 'image'];
    allowedFields.forEach((field) => {
      if (req.body[field]) {
        existingProduct[field] = req.body[field];
      }
    });

    if (req.file) {
      if (existingProduct.image) {
        // Xóa ảnh cũ
        fs.unlinkSync(existingProduct.image);
      }
      existingProduct.image = req.file.path;
    }

    // Lưu sản phẩm đã cập nhật
    const updatedProduct = await existingProduct.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Hàm xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const imagePath = path.join(__dirname, '../public/images', path.basename(deletedProduct.image));

    // Xóa ảnh từ hệ thống tệp
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.log(err);
      }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xem chi tiết sản phẩm
const getProductDetails = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId).exec();

    if (product) {
      res.status(200).json({ product });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().exec();

    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStock = async (req, res, next) => {
  // Trong hàm xử lý yêu cầu PUT
  const { id, newStock } = req.body;

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id }, // Điều kiện truy vấn
      { stock: newStock }, // Dữ liệu cập nhật
      { new: true } // Tùy chọn trả về bản ghi đã được cập nhật
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}

const onState = async (req, res, next) => {
  const id = req.body.id;
  if (!id) return res.status(400).send('Product not found');

  try {
    // Update the matching document to set the `state` field to `true`
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { state: true },
      { new: true } // Return the updated document
    );

    return res.send(updatedProduct);
  } catch (error) {
    res.status(500).json({ 'message': 'Error!' })
  }
}

const offState = async (req, res, next) => {
  const id = req.body.id;
  if (!id) return res.status(400).send('Product not found');

  try {
    // Update the matching document to set the `state` field to `true`
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { state: false },
      { new: true } // Return the updated document
    );

    return res.send(updatedProduct);
  } catch (error) {
    res.status(500).json({ 'message': 'Error!' })
  }
}

module.exports = {
  addProduct,
  updateProduct,
  updateStock,
  deleteProduct,
  addProductWithImageUpload,
  getProductDetails,
  getAllProducts,
  onState,
  offState
};
