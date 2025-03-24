const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    }, //

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },

    deadline: {
      type: Date,
    },

    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    }, // Task priority
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
