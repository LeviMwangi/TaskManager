const express = require('express');
const { protect, adminOnly } = require('../middlewares//authMiddleware');
const { 
    getDashboardData, 
    getUserDashboardData, 
    getTasks, 
    getTaskById, 
    createTask, 
    updateTask, 
    deleteTask, 
    updateTaskStatus, 
    updateTaskCheckList } = require('../controllers/taskController');

const router = express.Router();

//task management
router.get('/dashboard-data', protect, getDashboardData);
router.get('/dashboard-data/user', protect, getUserDashboardData);
router.get('/', protect, getTasks);
router.get('/:id', protect, getTaskById);
router.post('/', protect, adminOnly, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);
router.put('/:id/status', protect, updateTaskStatus);
router.put('/:id/todo', protect, updateTaskCheckList);

module.exports = router;
