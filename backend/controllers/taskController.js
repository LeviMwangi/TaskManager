const Task = require('../models/Task');

// @desc Get all tasks (Admin: all, users: only assigned tasks)
// @route GET /api/tasks/
// @access Private
const getTasks = async (req, res) => {
    try {
        const { status } = req.query; // Fixed typo
        let filter = {};

        if (status) {
            filter.status = status;
        }

        let tasks;

        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileurl"
            );
        } else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
                "assignedTo", // Fixed typo
                "name email profileImageUrl"
            );
        }

        // Add completed todoChecklist count to each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter(
                    (item) => item.completed // Fixed typo
                ).length;
                return { ...task._doc, completedTodoCount: completedCount };
            })
        );

        // Status summary counts
        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user._id }
        );

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "Pending",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: "InProgress", // Ensure consistency in status naming
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "Completed",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        res.json({
            tasks,
            statusSummary: {
                all: allTasks,
                pending: pendingTasks,
                inProgress: inProgressTasks,
                completed: completedTasks,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Get task by ID
// @route GET /api/tasks/:id
// @access Private
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl" // Fixed typo
        );

        if (!task) return res.status(404).json({ message: "Task not found" });

        res.json(task); // You missed sending the response
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Create a new task (Admin Only)
// @route POST /api/tasks/
// @access Private (Admin)
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist,
        } = req.body;

        if (!Array.isArray(assignedTo)) {
            return res
                .status(400)
                .json({ message: "assignedTo must be an array of user IDs" });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            todoChecklist,
            attachments,
        });

        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc Update task details
// @route PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: "Task not found" });

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        task.attachments = req.body.attachments || task.attachments;

        if (!Array.isArray(req.body.assignedTo)) {
            return res
                .status(400)
                .json({ message: "assignedTo must be an array of user IDs" });
        }

        task.assignedTo = req.body.assignedTo;

        await task.save(); // Save the updated task

        res.json({ message: "Task updated successfully", updateTask });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @dsec Delete a a task (Admin only)
// @route DELETE /api/tasks/:id
// @access Private(Admiin)
const deleteTask = async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: 'Task not found'});

        await task.deleteOne();
        res.json({ message: 'Task is deleted successfully'})
    } catch (error) {
        res.status(500).json({ message: 'server error', error: error.message})
    }
}

// @dsec Update  Task status
// @routes PUT /api/tasks/:id/status
// @access Private
const updateTaskStatus = async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({ message: 'Task not found'});

        const isAssigned = task.assignedTo.some(
            (userId) => userId.toString() === req.user._id.toString()
        );

        if (!isAssigned && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not Authorized'});
        }

        task.status = req.body.status || task.status;

        if (task.status === 'Completed') {
            task.todoChecklist.forEach((item) => (item.completed == true));
            task.progress = 100;
        }

        await task.save();
        res.json({ message: 'Task updated successfully',task});
    } catch (error) {
        res.status(500).json({ message: 'server error', error: error.message})
    }
}

//  @dsec  Update task checklist
// @routes PUT /api/tasks/:id/todo
// @access Private
const updateTaskCheckList = async (req, res) => {
    try{
        const { todoChecklist } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: 'Task not found'});

        if (!task.assignedTo.includes(req,user._id) && req.user.role !== 'admin')  {
            return res
            .status(403)
            .json({ message: 'Not authorized to update checklist'});
        }   

        task.todoChecklist = todoChecklist; //Replace with updated checklist

        //Auto-update progress based on checcklist completion
        const completedCount = task.todoChecklist.filter(
            (item) => item.completed
        ).length;
        const totalItems = task.todoChecklist.length;
        task.progress = 
            totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
           
        //Auto-mark task as completed 
        if (task.progress === 100) {
            task.status = 'completed';
        } else if (task.progress > 0) {
            task.status = 'In Progress'
        } else {
            task.status = 'Pending';
        }

        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate(
            'assignedTo',
            'name email profileImageUrl'
        );

        res.json({ message: 'Task checklist Updated', task: updatedTask });
    } catch (error) {
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