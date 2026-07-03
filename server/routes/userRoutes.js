const express = require('express');
const { getUsers, loginUser } = require('../controllers/userController');

const router = express.Router();

router.route('/').get(getUsers);
router.route('/login').post(loginUser);

module.exports = router;
