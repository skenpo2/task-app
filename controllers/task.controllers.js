const Task = require('../models/task.model');
const Category = require('../models/category.model');
const { validateTask, validateEditedTask } = require('../utils/validator');

const createTask = async (req, res) => {
  const { error } = validateTask(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'please provide all necessary task details',
    });
  }

  const { title, description, category, deadline, status, priority } = req.body;
  const userId = req.user.id;

  // Ensure the category (if provided) belongs to the user
  if (category) {
    const categoryExists = await Category.findOne({
      _id: category,
      user: userId,
    });
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category',
      });
    }
  }

  const newTask = new Task({
    user: userId,
    title,
    description,
    category,
    deadline,
    status,
    priority,
  });

  await newTask.save();
  res.status(201).json({
    success: true,
    data: newTask,
  });
};

const updateTask = async (req, res) => {
  const { error } = validateEditedTask(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'please provide valid  task details',
    });
  }

  const { taskId } = req.params;
  const { title, description, category, deadline, status, priority } = req.body;
  const userId = req.user.id;

  const task = await Task.findById(taskId);
  if (!task)
    return res.status(404).json({
      success: false,
      message: 'Task not found',
    });

  // Ensure only the task owner can edit
  if (task.user.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  // Validate category if provided
  if (category) {
    const categoryExists = await Category.findOne({
      _id: category,
      user: userId,
    });
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category',
      });
    }
    task.category = category;
  }

  // Update fields if provided
  if (title) task.title = title;
  if (description) task.description = description;
  if (category) task.category = category;
  if (status) task.status = status;
  if (priority) task.priority = priority;
  if (deadline) task.deadline = new Date(deadline);

  await task.save();
  res.status(200).json({
    success: true,
    data: task,
  });
};
const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;

  const task = await Task.findById(taskId);
  if (!task)
    return res.status(404).json({ success: false, message: 'Task not found' });

  if (task.user.toString() !== userId) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  await task.deleteOne();
  res.status(200).json({ success: true, message: 'Task deleted successfully' });
};

const getTask = async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id;

  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task)
    return res.status(404).json({ success: false, message: 'Task not found' });

  res.status(200).json({ success: true, data: task });
};

const getAllTasks = async (req, res) => {
  const userId = req.user.id;
  const {
    category,
    priority,
    deadline,
    sort,
    page = 1,
    limit = 10,
  } = req.query;

  const query = { user: userId };

  // Apply filters if provided
  if (category) query.category = category;
  if (priority) query.priority = priority;
  if (deadline) query.deadline = new Date(deadline);

  // Sorting: Default to newest first (descending order)
  const sortOrder = sort === 'asc' ? { createdAt: 1 } : { createdAt: -1 };

  // Pagination setup
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * pageSize;

  // Fetch tasks with filters, sorting, and pagination
  const tasks = await Task.find(query)
    .sort(sortOrder)
    .skip(skip)
    .limit(pageSize);

  // Count total tasks for pagination info
  const totalTasks = await Task.countDocuments(query);

  res.status(200).json({
    success: true,
    data: tasks,
    pagination: {
      totalTasks,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalTasks / pageSize),
      pageSize,
    },
  });
};

module.exports = { createTask, updateTask, deleteTask, getTask, getAllTasks };
