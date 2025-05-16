const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const { body, validationResult } = require('express-validator');

// Create a new project
router.post('/', auth, [
    body('name').trim().notEmpty().withMessage('Project name is required'),
    body('description').trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const project = new Project({
            ...req.body,
            owner: req.user._id
        });
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all projects for a user
router.get('/', auth, async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { owner: req.user._id },
                { members: req.user._id }
            ]
        }).populate('owner', 'name email');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific project
router.get('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            $or: [
                { owner: req.user._id },
                { members: req.user._id }
            ]
        }).populate('owner', 'name email')
          .populate('members', 'name email');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a project
router.patch('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'description', 'status', 'members'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates' });
        }

        updates.forEach(update => project[update] = req.body[update]);
        await project.save();
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a project
router.delete('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 