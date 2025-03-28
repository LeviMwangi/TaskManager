const Task = require('../models/Task');
const User = require('../models/User');
const bcrypt = require('bcryptjs')

// @desc Get all users(Admin Only)
// @route GET /api/users/
// @access Private (Admin)
const getUsers = async (req, res) => {
    try {
        const users = await user .find({ role: 'member'}).select('_password');

        //Add task counts to each user
        const usersWithTaskcounts = await Promise.all(users.map(async (user) => {
            const pendingTasks = await Task.countDocuments({ assingedTo: user._id, status: 'pending' });
            const  inProgressTaks = await Task.countDocuments({ assignedTo: user._id, status: 'In Progress'});
            const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: 'completed' });

            return {
                ...user._doc,
                pendingTasks,
                inProgressTaks,
                completedTasks
            };
        }));

        res.json(usersWithTaskcounts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message})
    }
};

// @desc Get user by id
// @route GET /api/users/:id
// @access Private 
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('_password');
            if (!user) return res.status(404).json({ message: 'user not found'});
            res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message})
    }
};



module.exports = { getUsers, getUserById};