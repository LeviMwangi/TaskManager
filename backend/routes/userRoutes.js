const express = require('express');
const { adminOnly, protect } = require('../middlewares/authMiddleware');
const { getUsers, getUserById, } = require('../controllers/userController');
const router = express.Router();

//user management routes
router.get('/', protect, adminOnly, getUsers);
router.get('/', protect, getUserById); 

module.exports = router;