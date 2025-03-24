const Category = require('../models/Category');

// @desc   Create a new category
// @route  POST /api/categories
// @access Private
const createCategory = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id; // Extract logged-in user

  // Check if category already exists for the user
  const existingCategory = await Category.findOne({ name, user: userId });
  if (existingCategory) {
    return res.status(400).json({
      success: false,
      message: 'Category already exists',
    });
  }

  const newCategory = new Category({ user: userId, name });
  await newCategory.save();
  res.status(201).json({
    success: false,
    data: newCategory,
  });
};

// @desc   Get all categories for the logged-in user
// @route  GET /api/categories
// @access Private
const getCategories = async (req, res) => {
  const userId = req.user.id;
  const categories = await Category.find({ user: userId });

  if (!categories) {
    return res.status(404).json({
      success: false,
      message: ' No category for this user',
    });
  }

  res.status(200).json({
    success: true,
    data: categories,
  });
};

// @desc   Update a category
// @route  PUT /api/categories/:id
// @access Private
const updateCategory = async (req, res) => {
  const { name } = req.body;
  const categoryId = req.params.id;
  const userId = req.user.id;

  // Find category and ensure it belongs to the user
  const category = await Category.findOne({ _id: categoryId, user: userId });
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
    });
  }
  // Update name if provided
  category.name = name || category.name;
  await category.save();

  res.status(200).json({
    success: true,
    data: category,
  });
};

// @desc   Delete a category
// @route  DELETE /api/categories/:id
// @access Private
const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  const userId = req.user.id;

  // Find category and ensure it belongs to the user
  const category = await Category.findOne({ _id: categoryId, user: userId });
  if (!category) {
    return res.status(404).json({
      success: false,
      message: 'Category not found',
    });
  }

  await category.deleteOne();
  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  });
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
