const Todo = require('../models/Todo');
const userController = require('../controllers/users');
const jwt = require('jsonwebtoken');
const path = require('path');

const createTask = async(req, res) => {
  try {
    const { userId, name, description, dueDate } = req.body;
    console.log(userId, name, description, dueDate);
    await Todo.createTask(userId, name, description, dueDate);
    res.redirect('/home');
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error: Could not create task. Please try again.' });
  }
};

const getTasks = async(req, res) => {
  try {
    const { userId } = req.body;
    console.log(`User Id: ${userId}`);
    const result = await Todo.getTasksByUserId(userId);
    if (result.length === 0) {
      res.json('There are no tasks yet.');
    }
    console.log(result);
    res.json(result);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error: Could not get all tasks from the user.' });
  }
};

const updateTask = async(req, res) => {
  const { task } = req.params;
  const { userId, name, description, dueDate } = req.body;
  try {
    const data = await Todo.updateTask(task, userId, name, description, dueDate);
    return res.status(200).json(data.rows);
  }
  catch (err) {
    res.status(500).json({ error: 'Internal Server Error: Task could not be updated.' });
  }
};

const deleteTask = (req, res) => {
  const { task } = req.params;
  const { userId } = req.body;
  Todo.deleteTask(task, userId)
    .then(() => res.status(204).json({ message: 'Task successfully deleted.' }))
    .catch(() => res.status(500).json({ error: 'Internal Server Error: Task could not be deleted.' }));
};

const isCompleted = (req, res) => {
  const { task } = req.params;
  const { userId, completed } = req.body;
  Todo.isCompleted(task, userId, completed)
    .then((data) => res.json(data.rows[0]))
    .catch(() => res.status(500).json({ error: 'Internal Server Error: Could not set task as completed.' }));
};

const getCreateTask = (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'createTask.html'));
};

const getUpdateTask = (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'updateTask.html'));
};


module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  isCompleted,
  getCreateTask,
  getUpdateTask,
};
