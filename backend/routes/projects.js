const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const { createProject, getAllProjects, getProject, updateProject, deleteProject } = require('../controllers/projectController');

// Create a new project
router.post('/', auth, [
    body('name').trim().notEmpty().withMessage('Project name is required'),
    body('description').trim()
], createProject);

// Get all projects for a user
router.get('/', auth, getAllProjects);

// Get a specific project
router.get('/:id', auth, getProject);

// Update a project
router.patch('/:id', auth, updateProject);

// Delete a project
router.delete('/:id', auth, deleteProject);

module.exports = router; 