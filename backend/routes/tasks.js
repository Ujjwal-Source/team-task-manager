const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

const VALID_STATUSES = ['todo', 'in-progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

// GET tasks (with optional projectId filter)
router.get('/', authenticate, (req, res) => {
  const { projectId, assignedTo } = req.query;
  let tasks = db.get('tasks').value();
  if (projectId) tasks = tasks.filter(t => t.projectId === projectId);
  if (assignedTo) tasks = tasks.filter(t => t.assignedTo === assignedTo);
  // Members only see their own tasks unless admin
  if (req.user.role !== 'admin') {
    const memberProjectIds = db.get('projectMembers').filter({ userId: req.user.id }).map('projectId').value();
    tasks = tasks.filter(t => memberProjectIds.includes(t.projectId));
  }
  // Enrich with assignee name
  const enriched = tasks.map(t => {
    const assignee = t.assignedTo ? db.get('users').find({ id: t.assignedTo }).value() : null;
    return { ...t, assigneeName: assignee?.name || null };
  });
  res.json(enriched);
});

// POST create task (admin only)
router.post('/', authenticate, requireAdmin, (req, res) => {
  const { title, description, projectId, assignedTo, dueDate, priority, status } = req.body;
  if (!title || !projectId) return res.status(400).json({ error: 'Title and projectId required' });
  const project = db.get('projects').find({ id: projectId }).value();
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const task = {
    id: uuidv4(),
    title,
    description: description || '',
    projectId,
    assignedTo: assignedTo || null,
    dueDate: dueDate || null,
    priority: VALID_PRIORITIES.includes(priority) ? priority : 'medium',
    status: VALID_STATUSES.includes(status) ? status : 'todo',
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.get('tasks').push(task).write();
  const assignee = task.assignedTo ? db.get('users').find({ id: task.assignedTo }).value() : null;
  res.status(201).json({ ...task, assigneeName: assignee?.name || null });
});

// PUT update task
router.put('/:id', authenticate, (req, res) => {
  const task = db.get('tasks').find({ id: req.params.id });
  if (!task.value()) return res.status(404).json({ error: 'Task not found' });

  const { title, description, assignedTo, dueDate, priority, status } = req.body;
  const isAdmin = req.user.role === 'admin';

  // Members can only update status of tasks assigned to them
  if (!isAdmin) {
    if (task.value().assignedTo !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
    if (status && VALID_STATUSES.includes(status)) {
      task.assign({ status, updatedAt: new Date().toISOString() }).write();
      return res.json(task.value());
    }
    return res.status(403).json({ error: 'Members can only update task status' });
  }

  const updates = { updatedAt: new Date().toISOString() };
  if (title) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (assignedTo !== undefined) updates.assignedTo = assignedTo;
  if (dueDate !== undefined) updates.dueDate = dueDate;
  if (priority && VALID_PRIORITIES.includes(priority)) updates.priority = priority;
  if (status && VALID_STATUSES.includes(status)) updates.status = status;

  task.assign(updates).write();
  const assignee = task.value().assignedTo ? db.get('users').find({ id: task.value().assignedTo }).value() : null;
  res.json({ ...task.value(), assigneeName: assignee?.name || null });
});

// DELETE task (admin only)
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  db.get('tasks').remove({ id: req.params.id }).write();
  res.json({ message: 'Task deleted' });
});

// GET dashboard stats
router.get('/dashboard/stats', authenticate, (req, res) => {
  let tasks = db.get('tasks').value();
  if (req.user.role !== 'admin') {
    const memberProjectIds = db.get('projectMembers').filter({ userId: req.user.id }).map('projectId').value();
    tasks = tasks.filter(t => memberProjectIds.includes(t.projectId));
  }
  const now = new Date();
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'done').length,
    myTasks: tasks.filter(t => t.assignedTo === req.user.id).length
  };
  res.json(stats);
});

module.exports = router;
