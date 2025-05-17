const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const { getProjectTasks, getTask, updateTask, deleteTask, createTask, getAllTasks } = require('../controllers/taskController');

// Create a new task
router.post('/', auth, [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('description').trim().notEmpty().withMessage('Task description is required'),
    body('status').isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status')
], createTask);

// Get all tasks for the current user
router.get('/', auth, getAllTasks);



// Get all tasks for a project
router.get('/project/:projectId', auth, getProjectTasks);

// Get a specific task
router.get('/:id', auth, getTask);

// Update a task
router.patch('/:id', auth, updateTask);

// Delete a task
router.delete('/:id', auth, deleteTask);

module.exports = router; 