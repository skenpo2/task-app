const express = require('express');
const verifyJWT = require('../middlewares/verifyJWT');
const router = express.Router();
const {
  updateUser,
  deleteUser,
  getUser,
} = require('../controllers/user.controller');

router.get('/', verifyJWT, getUser);
router.put('/', verifyJWT, updateUser);
router.delete('/', verifyJWT, deleteUser);

module.exports = router;
