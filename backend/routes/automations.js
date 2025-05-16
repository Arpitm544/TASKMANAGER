const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const automationController = require('../controllers/automationController');

// Create a new automation
router.post('/', auth, [
    body('name').trim().notEmpty().withMessage('Automation name is required'),
    body('project').notEmpty().withMessage('Project ID is required'),
    body('trigger').isIn(['task_created', 'task_completed', 'due_date_approaching', 'status_changed'])
        .withMessage('Invalid trigger type'),
    body('actions').isArray({ min: 1 }).withMessage('At least one action is required')
], automationController.createAutomation);

// Get all automations for a project
router.get('/project/:projectId', auth, automationController.getProjectAutomations);

// Get a specific automation
router.get('/:id', auth, automationController.getAutomation);

// Update an automation
router.patch('/:id', auth, automationController.updateAutomation);

// Delete an automation
router.delete('/:id', auth, automationController.deleteAutomation);

module.exports = router; 