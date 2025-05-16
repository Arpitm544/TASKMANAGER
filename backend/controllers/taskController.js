const Task = require('../models/Task');
const Project = require('../models/Project');

const taskController = {
    // Get all tasks for the current user
    getAllTasks: async (req, res) => {
        try {
            const tasks = await Task.find({ assignedTo: req.user._id })
                .sort({ createdAt: -1 });
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Create a new task
    createTask: async (req, res) => {
        try {
            const task = new Task({
                ...req.body,
                assignedTo: req.user._id
            });
            await task.save();
            res.status(201).json(task);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Get all tasks for a project
    getProjectTasks: async (req, res) => {
        try {
            // Check project access
            const project = await Project.findOne({
                _id: req.params.projectId,
                $or: [
                    { owner: req.user._id },
                    { members: req.user._id }
                ]
            });

            if (!project) {
                return res.status(404).json({ message: 'Project not found or access denied' });
            }

            const tasks = await Task.find({ project: req.params.projectId })
                .populate('assignedTo', 'name email')
                .sort({ createdAt: -1 });
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Get a specific task
    getTask: async (req, res) => {
        try {
            const task = await Task.findOne({
                _id: req.params.id,
                assignedTo: req.user._id
            }).populate('project', 'name');

            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            res.json(task);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Update a task
    updateTask: async (req, res) => {
        try {
            const task = await Task.findOne({
                _id: req.params.id,
                assignedTo: req.user._id
            });

            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            const updates = Object.keys(req.body);
            const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate'];
            const isValidOperation = updates.every(update => allowedUpdates.includes(update));

            if (!isValidOperation) {
                return res.status(400).json({ message: 'Invalid updates' });
            }

            updates.forEach(update => task[update] = req.body[update]);
            await task.save();
            res.json(task);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Delete a task
    deleteTask: async (req, res) => {
        try {
            const task = await Task.findOne({
                _id: req.params.id,
                assignedTo: req.user._id
            });

            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            await task.deleteOne();
            res.json(task);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = taskController; 