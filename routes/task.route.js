const express = require('express');
const verifyJWT = require('../middlewares/verifyJWT');
const {
  getTask,
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/task.controllers');

const router = express.Router();

router.get('/:id', verifyJWT, getTask);
router.get('/', verifyJWT, getAllTasks);
router.post('/', verifyJWT, createTask);
router.put('/:id', verifyJWT, updateTask);
router.delete('/:id', verifyJWT, deleteTask);

module.exports = router;
