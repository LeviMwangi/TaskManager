const Task =require('../models/Task');
const User =require('../models/User')
const excelJs = require('exceljs')

// @dsec Export all Tasks an an excel file
// @route GET/api/reports/export/tasks
// @access Private(Admin)
const exportTaskReport = async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'name email');

        const workbook = new excelJs.workbook();
        const worksheet = new excelJs.addWorkSheet('Tasks Report');

        worksheet.colums = [
            { header: 'Task ID', key: '_id', width: 25},
            { header: 'Title', key: 'title', width: 30},
            { header: 'Description', key: 'description', width: 50},
            { header: 'Priority', key: 'priority', width: 15},
            { header: 'Status', key: 'status', width: 20},
            { header: 'Due Date', key: 'dueDate', width: 20},
            { header: 'Assigned To', key: 'assignedTo', width: 30},
            
        ];

        tasks.forEach((task) => {
            const assignedTo =task.assignedTo
            .map((user) => `${user.name} (${user.email})`)
            .join(', ')
            worksheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate.toISOString().split('T')[0],
                assignedTo: assignedTo || 'Unassigned'
            });
        });
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officialdocument.spreadaheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="tasks_report.xlsx"'
        );

        return workbook.xlsx.write(res).then(() => {
            res.end();
        })
    } catch (error) {
        res.status(500).json({ message: 'Error epxortiing tasks', error: error.message });
    }
};

// @dsec Export user-task report as an excel file
// @route GET /api/reports/export/users
// @access Private (Admin)
const exportUsersReport = async (req, res) => {
    try {
        const users = await User.find().select('name email _id').lean();
        const userTasks = await Task.find().populate(
            'assignedTo',
            'name email _id'
        );

        const userTaskMap = {};
        users.forEach((user) => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            }
        });
        userTasks.forEach((task) => {
            if (task.assignedTo) {
                task.assignedTo.forEach((assignedUser) => {
                    if(userTaskMap[assignedUser._id]) {
                        userTaskMap[assignedUser._id].taskCount += 1;
                    } if (task.status === "Pending") {
                        userTaskMap[assignedUser._id].pendingTasks += 1;
                    } else if (task.status === "In Progress") {
                        userTaskMap[assignedUser._id].inProgressTasks += 1;
                    } else if (task.status === 'completed') {
                       userTaskMap[assignedUser._id].completedTasks += 1;
                    }
                });
            }
        });

        const workbook = new excelJs.workbook();
        const worksheet = workbook.addWorkSheet('User Task Report')

        worksheet.colums = [
            { header: 'User Name', key: 'name', width: 30},
            { header: 'Email', key: 'email', width: 40},
            { header: 'Total Assigned', key: 'taskCount', width: 20},
            { header: 'Pending Tasks', key: 'pendingTasks', width: 20},
            { 
                header: 'In progress Tasks', 
                key: 'InProgressTasks', 
                width: 20,
            },
            { header: 'Completed Tasks', key: 'completedTasks', width: 20},
        ];

        Object.values(userTaskMap).forEach((user) => {
            worksheet.addRow(user);
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officialdocument.spreadaheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="tasks_report.xlsx"'
        );

        return workbook.xlsx.write(res).then(() => {
            res.end();
        })
    } catch (error) {
        res.status(500).json({ message: 'Error epxortiing tasks', error: error.message });
    }
};

module.exports = {
    exportTaskReport,
    exportUsersReport,
}