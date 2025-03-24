const express = require('express');
const verifyJWT = require('../middlewares/verifyJWT');
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} = require('../controllers/category.controller');
const router = express.Router();

router.get('/', verifyJWT, getCategories);
router.post('/', verifyJWT, createCategory);
router.put('/:id', verifyJWT, updateCategory);
router.delete('/:id', verifyJWT, deleteCategory);

module.exports = router;
