const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET all projects for current user
router.get('/', authenticate, (req, res) => {
  const { id, role } = req.user;
  let projects;
  if (role === 'admin') {
    projects = db.get('projects').value();
  } else {
    const memberProjectIds = db.get('projectMembers').filter({ userId: id }).map('projectId').value();
    projects = db.get('projects').filter(p => memberProjectIds.includes(p.id)).value();
  }
  // Enrich with member count and task stats
  const enriched = projects.map(p => {
    const members = db.get('projectMembers').filter({ projectId: p.id }).value();
    const tasks = db.get('tasks').filter({ projectId: p.id }).value();
    const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;
    return { ...p, memberCount: members.length, taskCount: tasks.length, overdueCount: overdue };
  });
  res.json(enriched);
});

// POST create project (admin only)
router.post('/', authenticate, requireAdmin, (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Project name required' });

  const project = {
    id: uuidv4(),
    name,
    description: description || '',
    createdBy: req.user.id,
    createdAt: new Date().toISOString()
  };
  db.get('projects').push(project).write();
  // Auto-add creator as member
  db.get('projectMembers').push({ id: uuidv4(), projectId: project.id, userId: req.user.id, addedAt: new Date().toISOString() }).write();
  res.status(201).json(project);
});

// GET single project
router.get('/:id', authenticate, (req, res) => {
  const project = db.get('projects').find({ id: req.params.id }).value();
  if (!project) return res.status(404).json({ error: 'Project not found' });
  const members = db.get('projectMembers').filter({ projectId: project.id }).value().map(m => {
    const user = db.get('users').find({ id: m.userId }).value();
    return user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null;
  }).filter(Boolean);
  res.json({ ...project, members });
});

// PUT update project (admin only)
router.put('/:id', authenticate, requireAdmin, (req, res) => {
  const { name, description } = req.body;
  const project = db.get('projects').find({ id: req.params.id });
  if (!project.value()) return res.status(404).json({ error: 'Project not found' });
  project.assign({ name, description, updatedAt: new Date().toISOString() }).write();
  res.json(project.value());
});

// DELETE project (admin only)
router.delete('/:id', authenticate, requireAdmin, (req, res) => {
  db.get('projects').remove({ id: req.params.id }).write();
  db.get('tasks').remove({ projectId: req.params.id }).write();
  db.get('projectMembers').remove({ projectId: req.params.id }).write();
  res.json({ message: 'Project deleted' });
});

// POST add member to project (admin only)
router.post('/:id/members', authenticate, requireAdmin, (req, res) => {
  const { userId } = req.body;
  const project = db.get('projects').find({ id: req.params.id }).value();
  if (!project) return res.status(404).json({ error: 'Project not found' });
  const user = db.get('users').find({ id: userId }).value();
  if (!user) return res.status(404).json({ error: 'User not found' });
  const existing = db.get('projectMembers').find({ projectId: req.params.id, userId }).value();
  if (existing) return res.status(409).json({ error: 'Already a member' });

  db.get('projectMembers').push({ id: uuidv4(), projectId: req.params.id, userId, addedAt: new Date().toISOString() }).write();
  res.json({ message: 'Member added' });
});

// DELETE remove member (admin only)
router.delete('/:id/members/:userId', authenticate, requireAdmin, (req, res) => {
  db.get('projectMembers').remove({ projectId: req.params.id, userId: req.params.userId }).write();
  res.json({ message: 'Member removed' });
});

module.exports = router;
