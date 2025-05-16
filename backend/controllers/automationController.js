const Automation = require('../models/Automation');
const Project = require('../models/Project');

const automationController = {
    // Create a new automation
    createAutomation: async (req, res) => {
        try {
            // Check if user has access to the project
            const project = await Project.findOne({
                _id: req.body.project,
                owner: req.user._id // Only project owner can create automations
            });

            if (!project) {
                return res.status(404).json({ message: 'Project not found or access denied' });
            }

            const automation = new Automation({
                ...req.body,
                createdBy: req.user._id
            });
            await automation.save();
            res.status(201).json(automation);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Get all automations for a project
    getProjectAutomations: async (req, res) => {
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

            const automations = await Automation.find({ project: req.params.projectId })
                .populate('createdBy', 'name email');
            res.json(automations);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Get a specific automation
    getAutomation: async (req, res) => {
        try {
            const automation = await Automation.findById(req.params.id)
                .populate('createdBy', 'name email')
                .populate('project', 'name');

            if (!automation) {
                return res.status(404).json({ message: 'Automation not found' });
            }

            // Check project access
            const project = await Project.findOne({
                _id: automation.project,
                $or: [
                    { owner: req.user._id },
                    { members: req.user._id }
                ]
            });

            if (!project) {
                return res.status(404).json({ message: 'Access denied' });
            }

            res.json(automation);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Update an automation
    updateAutomation: async (req, res) => {
        try {
            const automation = await Automation.findById(req.params.id);
            if (!automation) {
                return res.status(404).json({ message: 'Automation not found' });
            }

            // Check project access
            const project = await Project.findOne({
                _id: automation.project,
                owner: req.user._id // Only project owner can update automations
            });

            if (!project) {
                return res.status(404).json({ message: 'Access denied' });
            }

            const updates = Object.keys(req.body);
            const allowedUpdates = ['name', 'trigger', 'conditions', 'actions', 'isActive'];
            const isValidOperation = updates.every(update => allowedUpdates.includes(update));

            if (!isValidOperation) {
                return res.status(400).json({ message: 'Invalid updates' });
            }

            updates.forEach(update => automation[update] = req.body[update]);
            await automation.save();
            res.json(automation);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Delete an automation
    deleteAutomation: async (req, res) => {
        try {
            const automation = await Automation.findById(req.params.id);
            if (!automation) {
                return res.status(404).json({ message: 'Automation not found' });
            }

            // Check project access
            const project = await Project.findOne({
                _id: automation.project,
                owner: req.user._id // Only project owner can delete automations
            });

            if (!project) {
                return res.status(404).json({ message: 'Access denied' });
            }

            await automation.remove();
            res.json(automation);
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = automationController; 