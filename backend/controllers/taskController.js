const Task = require('../models/Task');
const task = require('../models/Task')

// @dsec Get all tasks (Admin: all, userS: only assigned tasks )
// @route GET /api/tasks/
// @access Priavte
const getTasks = async (req, res) => {
    try{
        const { status } = req.querry;
        let filter = {};

        if (status) {
            filter.status = status;
        }

        let tasks;

        if (req.user.role === "admin" ) {
            tasks = await Task.find(filter).populate (
                "assignedTo",
                'name email profileurl'
            );
        } else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id}).populate(
                'assignedto',
                'name email profileImageUrl'
            )
        }

        //Add completed todoCheckList count to each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.dodoChecklist.filter(
                    (item) => item.completed
                ).length;
                return { ...task._doc, completedTodoCount: completedCount }
            })
        );

        //status summary counts
    } catch (error) {
        res.status(500).json({ message: 'server error', error: error.message})
    }
}

// @dsec Get task by ID
// @route GET /api/tasks/:id
// @access Private
const getTaskById = async (req, res) => {
    try{} catch (error) {
        res.status(500).json({ message: 'server error', error: error.message})
    }
}

// @dsec create a new task (Admmin Only)
// @route POST /api/tasks/
// @access Private (Admin)
const createTask = async (req, res) => {
    try{
        const {
            title,
            descreption,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist,
        } = req.body
        
        if (!Array.isArray(assignedTo)) {
            return res
            .status(400)
            .json({ message: 'assignedTo must be an array of user IDs' })
        }

        const task = await Task.create({
            title,
            descreption,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            todoChecklist,
            attachments
        });

        res.status(201).json({ message: 'Task created successfully', task })
    } catch (error) {
        res.status(500).json({ message: 'server error', error: error.message})
    }
}

// @dsec Update task details
// @route PUT /api/tasks/:id
// @access Private
const updateTask = async => { 
    try{} catch (error) {
    res.status(500).json({ message: 'server error', error: error.message})
}}

// @dsec Delete a a task (Admin only)
// @route DELETE /api/tasks/:id
// @access Private(Admiin)
const deleteTask = async (req, res) => {
    try{} catch (error) {
        res.status(500).json({ message: 'server error', error: error.message})
    }
}

// @dsec Update  Task status
// @routes PUT /api/tasks/:id/status
// @access Private
const updateTaskStatus = async (req, res) => {
    try{} catch (error) {
        res.status(500).json({ message: 'server error', error: error.message})
    }
}

//  @dsec  Update task checklist
// @routes PUT /api/tasks/:id/todo
// @access Private
const updateTaskCheckList = async (req, res) => {
    try{} catch (error) {
        res.status(500).json({ message: 'server error', error: error.message})
    }
}

// @dsec dashboard data (Admin Only)
// @route GET/api/tasks/dashboard-data
// @access private
const getDashboardData = async (req, res) => {
    try{} catch (error) {
        res.status(500).json({ message: 'server error', error: error.message})
    }
}

// @dsec Dashboard Data (user-specific)
// @route GET /api/tasks/user-dashboard-data
// @access Private
const getUserDashboardData = async (req, res) => {
    try{} catch (error) {
        res.status(500).json({ message: 'server error', error: error.message})
    }
}

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskCheckList,
    getDashboardData,
    getUserDashboardData
}