const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { authenticateUser } = require('../middlewares/auth');

router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.get('/getUser/:id', authenticateUser, userController.getUserProfile)


module.exports = router;