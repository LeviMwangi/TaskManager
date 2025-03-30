const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

//@desc   Register a new user
//@route  POST /api/auth/register
//@access Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl, adminInviteToken } =
            req.body;

        //check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "user already exists" });
        }

        // Determine user role; Admin if correct token is provided, otherwise member
        if (adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN) {
            role = "admin";
        } else {
            role = "member";
        }

        //Hash password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create new User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role
        });

        //return user data with jtw
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    };
};


//@desc   Login user
//@route  POST /api/auth/register
//@access Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        // Return User data with JWT
        res.json({
            message: "Login Successful",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id)
        })
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message })
    }
};

//@desc   Get user profile
//@route  GET /api/auth/Profile
//@access Private(Requires JWT)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        if (!user) {
            return res.status(404).json({ message: 'user not found' })
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message })
    }
};

//@desc   Update user profile
//@route  POST /api/auth/profile
//@access Private(Requires JWT)
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const updates = req.body;

        if (!user) {
            return res.status(404).json({ message: "user not found " });
        }

        // Only allow updating specified fields
        const allowedUpdates = ["name", "email", "password", "profileImageUrl"];
        
        const updateKeys = Object.keys(updates);
        const isValidUpdate = updateKeys.every(key => allowedUpdates.includes(key));

        if (!isValidUpdate) {
            return res.status(400).json({ message: "Invalid update fields" });
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
            new: true,
            runValidators: true
        });

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.json({message: "profile updated", updatedUser});
    
    } catch (error) {
        res.status(500).json({ message: "server error", error: error.message })
    }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };