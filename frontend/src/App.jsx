import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Users from './pages/Users';
import Sidebar from './components/Sidebar';
import './index.css';

function AppInner() {
  const { user, loading } = useAuth();
  const [authPage, setAuthPage] = useState('login');
  const [page, setPage] = useState('dashboard');

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div className="spinner" style={{ width: 40, height: 40 }} />
    </div>
  );

  if (!user) {
    return authPage === 'login'
      ? <Login onSwitch={() => setAuthPage('signup')} />
      : <Signup onSwitch={() => setAuthPage('login')} />;
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard setPage={setPage} />;
      case 'projects': return <Projects />;
      case 'tasks': return <Tasks />;
      case 'users': return user.role === 'admin' ? <Users /> : <Dashboard setPage={setPage} />;
      default: return <Dashboard setPage={setPage} />;
    }
  };

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1a1a24', color: '#f0f0ff', border: '1px solid #2a2a38', fontSize: '13px' },
          success: { iconTheme: { primary: '#43e97b', secondary: '#1a1a24' } },
          error: { iconTheme: { primary: '#ff6584', secondary: '#1a1a24' } },
        }}
      />
      <AppInner />
    </AuthProvider>
  );
}
