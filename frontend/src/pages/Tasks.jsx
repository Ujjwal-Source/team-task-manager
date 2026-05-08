import { useEffect, useState } from 'react';
import { tasks, projects, users } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Trash2, X, Filter } from 'lucide-react';

function TaskModal({ onClose, onSave, initial, projectList, userList }) {
  const [form, setForm] = useState(initial || {
    title: '', description: '', projectId: '', assignedTo: '', dueDate: '', priority: 'medium', status: 'todo'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.projectId) return toast.error('Title and project required');
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="modal-title" style={{ margin: 0 }}>{initial ? 'Edit Task' : 'Create Task'}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input className="form-control" placeholder="Task title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" rows={2} placeholder="Details..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Project *</label>
              <select className="form-control" value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })}>
                <option value="">Select project</option>
                {projectList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Assign To</label>
              <select className="form-control" value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })}>
                <option value="">Unassigned</option>
                {userList.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input className="form-control" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select className="form-control" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : (initial ? 'Save Changes' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Tasks() {
  const { user } = useAuth();
  const [taskList, setTaskList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState({ status: '', priority: '', projectId: '' });

  const isAdmin = user?.role === 'admin';

  const load = () => {
    const fetches = [tasks.getAll(), projects.getAll()];
    if (isAdmin) fetches.push(users.getAll());
    Promise.all(fetches).then(([t, p, u]) => {
      setTaskList(t.data);
      setProjectList(p.data);
      if (u) setUserList(u.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const isOverdue = (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done';

  const filtered = taskList.filter(t => {
    if (filter.status && t.status !== filter.status) return false;
    if (filter.priority && t.priority !== filter.priority) return false;
    if (filter.projectId && t.projectId !== filter.projectId) return false;
    return true;
  });

  const handleCreate = async (form) => {
    const res = await tasks.create(form);
    setTaskList(prev => [res.data, ...prev]);
    toast.success('Task created!');
  };

  const handleEdit = async (form) => {
    const res = await tasks.update(editTask.id, form);
    setTaskList(prev => prev.map(t => t.id === editTask.id ? res.data : t));
    setEditTask(null);
    toast.success('Task updated!');
  };

  const handleStatusChange = async (task, status) => {
    try {
      const res = await tasks.update(task.id, { status });
      setTaskList(prev => prev.map(t => t.id === task.id ? { ...t, status: res.data.status } : t));
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    await tasks.delete(id);
    setTaskList(prev => prev.filter(t => t.id !== id));
    toast.success('Task deleted');
  };

  const getProjectName = (id) => projectList.find(p => p.id === id)?.name || '—';

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAdmin ? 'All Tasks' : 'My Tasks'}</h1>
          <p className="page-subtitle">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> New Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '14px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Filter size={14} style={{ color: 'var(--muted)' }} />
          <select className="form-control" style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }} value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
            <option value="">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select className="form-control" style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }} value={filter.priority} onChange={e => setFilter({ ...filter, priority: e.target.value })}>
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select className="form-control" style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }} value={filter.projectId} onChange={e => setFilter({ ...filter, projectId: e.target.value })}>
            <option value="">All Projects</option>
            {projectList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          {(filter.status || filter.priority || filter.projectId) && (
            <button className="btn btn-ghost btn-sm" onClick={() => setFilter({ status: '', priority: '', projectId: '' })}>Clear</button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <div className="empty-title">No tasks found</div>
          <div className="empty-text">{isAdmin ? 'Create your first task' : 'No tasks assigned to you yet'}</div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className={isOverdue(t) ? 'task-row-overdue' : ''}>
                    <td>
                      <div style={{ fontWeight: 500, color: isOverdue(t) ? 'var(--overdue)' : 'var(--text)' }}>{t.title}</div>
                      {t.description && <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{t.description.slice(0, 50)}{t.description.length > 50 ? '…' : ''}</div>}
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: '12px' }}>{getProjectName(t.projectId)}</td>
                    <td style={{ fontSize: '12px' }}>
                      {t.assigneeName ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div className="user-avatar" style={{ width: 22, height: 22, fontSize: 10 }}>{t.assigneeName[0]}</div>
                          {t.assigneeName}
                        </div>
                      ) : <span style={{ color: 'var(--muted)' }}>—</span>}
                    </td>
                    <td><span className={`badge badge-${t.priority}`}>{t.priority}</span></td>
                    <td style={{ fontSize: '12px', color: isOverdue(t) ? 'var(--overdue)' : 'var(--muted)' }}>
                      {t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-IN') : '—'}
                      {isOverdue(t) && <span style={{ marginLeft: 4 }}>🔥</span>}
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{ padding: '4px 8px', fontSize: '11px', width: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', color: t.status === 'done' ? 'var(--done)' : t.status === 'in-progress' ? 'var(--inprogress)' : 'var(--todo)' }}
                        value={t.status}
                        onChange={e => handleStatusChange(t, e.target.value)}
                      >
                        <option value="todo">📋 To Do</option>
                        <option value="in-progress">⚡ In Progress</option>
                        <option value="done">✅ Done</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {isAdmin && (
                          <>
                            <button className="btn btn-ghost btn-sm" onClick={() => setEditTask(t)} style={{ padding: '4px 8px' }}>✏️</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)} style={{ padding: '4px 8px' }}><Trash2 size={12} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && <TaskModal onClose={() => setShowModal(false)} onSave={handleCreate} projectList={projectList} userList={userList} />}
      {editTask && <TaskModal onClose={() => setEditTask(null)} onSave={handleEdit} initial={editTask} projectList={projectList} userList={userList} />}
    </div>
  );
}
