const Project = require('../models/Project');

const createProject = async (req, res) => {
  try {
    const project = await new Project({ ...req.body, owner: req.user._id }).save();
    res.status(201).json(project);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }]
    }).populate('owner members', 'name email');
    res.json(projects);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [{ owner: req.user._id }, { members: req.user._id }]
    }).populate('owner members', 'name email');
    res.status(project ? 200 : 404).json(project || { message: 'Project not found' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    res.status(project ? 200 : 404).json(project || { message: 'Project not found' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    res.status(project ? 200 : 404).json(project || { message: 'Project not found' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject
};