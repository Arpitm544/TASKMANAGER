const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');

// Get all tasks for the current user
router.get('/', auth, taskController.getAllTasks);

// Create a new task
router.post('/', auth, [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('description').trim().notEmpty().withMessage('Task description is required'),
    body('status').isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status')
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