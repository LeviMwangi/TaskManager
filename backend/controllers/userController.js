const Task = require('../models/Task');
const User = require('../models/User');
const bcrypt = require('bcryptjs')

// @desc Get all users(Admin Only)
// @route GET /api/users/
// @access Private (Admin)
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'member'}).select('_password');

        //Add task counts to each user
        const usersWithTaskcounts = await Promise.all(users.map(async (user) => {
            // const name = user.name;
            const pendingTasks = await Task.countDocuments({ assingedTo: user._id, status: 'pending' });
            const  inProgressTaks = await Task.countDocuments({ assignedTo: user._id, status: 'In Progress'});
            const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: 'completed' });

            return {
                ...user._doc,
                // name,
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
        const { id } = req.params
        const user = await User.findById({_id: id});
            if (!user) return res.status(404).json({ message: 'user not found'});
            res.json({ message: "User Found", user: { id: user._id, name: user.name, email: user.email, role: user.role, userProfileURL: user.profileImageUrl, createdAt: user.createdAt, updatedAt: user.updatedAt} });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message})
    }
};



module.exports = { getUsers, getUserById};