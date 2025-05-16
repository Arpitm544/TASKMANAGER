const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { body, validationResult } = require('express-validator');

// Create a new task
router.post('/', auth, [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('project').notEmpty().withMessage('Project ID is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if user has access to the project
        const project = await Project.findOne({
            _id: req.body.project,
            $or: [
                { owner: req.user._id },
                { members: req.user._id }
            ]
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found or access denied' });
        }

        const task = new Task({
            ...req.body,
            assignedTo: req.body.assignedTo || req.user._id
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all tasks for a project
router.get('/project/:projectId', auth, async (req, res) => {
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
});

// Get a specific task
router.get('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .populate('project', 'name');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check project access
        const project = await Project.findOne({
            _id: task.project,
            $or: [
                { owner: req.user._id },
                { members: req.user._id }
            ]
        });

        if (!project) {
            return res.status(404).json({ message: 'Access denied' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a task
router.patch('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check project access
        const project = await Project.findOne({
            _id: task.project,
            $or: [
                { owner: req.user._id },
                { members: req.user._id }
            ]
        });

        if (!project) {
            return res.status(404).json({ message: 'Access denied' });
        }

        const updates = Object.keys(req.body);
        const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate', 'assignedTo'];
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
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check project access
        const project = await Project.findOne({
            _id: task.project,
            owner: req.user._id // Only project owner can delete tasks
        });

        if (!project) {
            return res.status(404).json({ message: 'Access denied' });
        }

        await task.remove();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 