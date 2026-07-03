const User = require('../models/User');

// @desc    Get all users (for display purposes only)
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-createdAt -updatedAt -__v');
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Login mock user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (user && user.password === password) {
      // Use Base64 encoding of ID as a simple token
      const token = Buffer.from(user._id.toString()).toString('base64');
      
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  loginUser,
};
