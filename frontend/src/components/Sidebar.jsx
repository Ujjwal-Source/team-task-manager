import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, LogOut } from 'lucide-react';

export default function Sidebar({ page, setPage }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
    ...(user?.role === 'admin' ? [{ id: 'users', label: 'Users', icon: Users }] : []),
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        TaskFlow
        <span>Team Task Manager</span>
      </div>
      <nav>
        {navItems.map(({ id, label, icon: Icon }) => (
          <div key={id} className={`nav-item ${page === id ? 'active' : ''}`} onClick={() => setPage(id)}>
            <Icon size={16} />
            {label}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-block btn-sm" onClick={logout}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </div>
  );
}
