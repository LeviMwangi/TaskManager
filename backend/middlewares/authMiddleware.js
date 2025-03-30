const jwt = require('jsonwebtoken')
const User = require('../models/User');

//Middleware to protect routes
const protect = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Bearer token
    if (!token) return res.status(401).json({ message: "Access denied. No token provided" });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) return res.status(404).json({ message: "User not found" });
        next();

    } catch (error) {
        res.status(401).json({ message: "Token failed", error: error.message })
    }
}

//Middleware for admin only
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        res.status(403).json({ message: 'Access denied, admin only' });
    }
}

module.exports = { protect, adminOnly }