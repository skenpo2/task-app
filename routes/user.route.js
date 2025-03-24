const express = require('express');
const verifyJWT = require('../middlewares/verifyJWT');
const router = express.Router();
const {
  updateUser,
  deleteUser,
  getUser,
} = require('../controllers/user.controller');

router.get('/:userId', verifyJWT, getUser);
router.delete('/', verifyJWT, deleteUser);
router.put('/', verifyJWT, updateUser);

module.exports = router;
