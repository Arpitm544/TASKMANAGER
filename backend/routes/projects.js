const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const projectController = require('../controllers/projectController');

// Create a new project
router.post('/', auth, [
    body('name').trim().notEmpty().withMessage('Project name is required'),
    body('description').trim()
], projectController.createProject);

// Get all projects for a user
router.get('/', auth, projectController.getAllProjects);

// Get a specific project
router.get('/:id', auth, projectController.getProject);

// Update a project
router.patch('/:id', auth, projectController.updateProject);

// Delete a project
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router; 