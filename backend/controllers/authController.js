const User = require("../models/User");
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECREET, {expiresIn: '7d'});
};

//@desc   Register a new user
//@route  POST /api/auth/register
//@access Public
const registerUser = async (req, res) => {};


//@desc   Login user
//@route  POST /api/auth/register
//@access Public
const loginUser = async (req, res) => {};

//@desc   Get user profile
//@route  GET /api/auth/Profile
//@access Private(Requires JWT)
const getUserProfile = async (req, res) => {};

//@desc   Update user profile
//@route  POST /api/auth/profile
//@access Private(Requires JWT)
const updateUserProfile = async (req, res) => {};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };