const Task = require('../models/Task');
const Project = require('../models/Project');

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const createTask = async (req, res) => {
  try {
    const task = await new Task({ ...req.body, assignedTo: req.user._id }).save();
    res.status(201).json(task);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      $or: [{ owner: req.user._id }, { members: req.user._id }]
    });
    if (!project) return res.status(404).json({ message: 'Project not found or access denied' });

    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      assignedTo: req.user._id
    }).populate('project', 'name');
    res.status(task ? 200 : 404).json(task || { message: 'Task not found' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, assignedTo: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const allowed = ['title', 'description', 'status', 'priority', 'dueDate'];
    const updates = Object.keys(req.body);
    if (!updates.every(k => allowed.includes(k)))
      return res.status(400).json({ message: 'Invalid updates' });

    updates.forEach(k => task[k] = req.body[k]);
    await task.save();
    res.json(task);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, assignedTo: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.deleteOne();
    res.json(task);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  getProjectTasks,
  getTask,
  updateTask,
  deleteTask
};