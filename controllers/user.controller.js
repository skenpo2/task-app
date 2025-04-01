const User = require('../models/user.model');
const { validateEditedUser } = require('../utils/validator');

// @desc   update a user info
// @route  PUT /api/user
// @access Private (only a logged user can change his or her info)
const updateUser = async (req, res) => {
  const userId = req.user.id; //get user from JWT
  const { email, password, name } = req.body;

  //valid entries
  const { error } = validateEditedUser(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Please provide necessary details',
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User does not exist',
    });
  }

  if (email) user.email = email;
  if (name) user.name = name;
  if (password) user.password = password;

  await user.save();

  user.password = '';
  res.status(200).json({
    success: true,
    data: user,
  });
};

// @desc   delete a user account
// @route  DELETE /api/user
// @access Private (only a logged user can delete his or her account)
const deleteUser = async (req, res) => {
  const userId = req.user.id; //get user from JWT
  const password = req.body.password;

  const isUser = await User.findById(userId);
  if (!isUser) {
    return res.status(400).json({
      success: false,
      message: 'User does not exist',
    });
  }

  // users must verify their own password

  const isValidPassword = password
    ? await isUser.verifyPassword(password)
    : null;
  if (!isValidPassword) {
    return res.status(400).json({
      success: false,
      message: 'Incorrect Credentials',
    });
  }

  await User.findOneAndDelete({ _id: userId });

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
};

// @desc   get a user info
// @route  GET /api/user
// @access Private (only a logged user can get his or her account details)
const getUser = async (req, res) => {
  const userId = req.user.id; //get user id from JWT

  const user = await User.findById(userId).select('name email');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};

module.exports = { updateUser, deleteUser, getUser };
