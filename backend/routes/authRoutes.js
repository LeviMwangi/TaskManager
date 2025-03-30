const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

//Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.patch('/profile', protect, updateUserProfile);

router.post('upload-image', upload.single('image'), (res, req) => {
    if (!req.file) {
        return res.statusCode(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `${req.protocal}://${req.get('host')}/upload/${
        req.file.filename
    }`;
    res.statusCode(200).json({ imageUrl });
})


module.exports = router;