const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');

// Create a new task
router.post('/', auth, [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('project').notEmpty().withMessage('Project ID is required')
], taskController.createTask);

// Get all tasks for a project
router.get('/project/:projectId', auth, taskController.getProjectTasks);

// Get a specific task
router.get('/:id', auth, taskController.getTask);

// Update a task
router.patch('/:id', auth, taskController.updateTask);

// Delete a task
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router; 