const express = require('express');
const { adminOnly, protect } = require('../middlewares/authMiddleware');
const { getUsers, getUserById, } = require('../controllers/userController');
const router = express.Router();

//user management routes
router.get('/users', protect, adminOnly, getUsers);
router.get('/user/:id', protect, getUserById); 

module.exports = router;