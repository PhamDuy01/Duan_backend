const Category = require('../model/category.model');

// Hàm thêm danh mục
const createCategory = async (req, res) => {
    const { name, description } = req.body;
    // Kiểm tra các trường bắt buộc
    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    const foundCategory = await Category.findOne({ name: name }).exec();
    if (foundCategory) {
        return res.status(400).json({ message: "Category already exists!" });
    }

    try {
        const newCategory = new Category({
            name,
            description
        });

        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Hàm sửa danh mục
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Hàm xóa danh mục
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy tất cả danh mục
const getAllCategories = async (req, res) => {
    try {
      const category = await Category.find().exec();
  
      res.status(200).json({ category });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories
};
