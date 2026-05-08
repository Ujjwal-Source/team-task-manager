import { useEffect, useState } from "react";
import { tasks, projects } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard({ setPage }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([tasks.getStats(), tasks.getAll(), projects.getAll()])
      .then(([s, t, p]) => {
        setStats(s.data);
        setRecentTasks(t.data.slice(0, 5));
        setProjectList(p.data.slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const isOverdue = (t) =>
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done";

  if (loading)
    return (
      <div className="loading-center">
        <div className="spinner" />
      </div>
    );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name} 👋</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card todo">
          <div className="stat-label">📋 To Do</div>
          <div className="stat-value">{stats?.todo ?? 0}</div>
        </div>
        <div className="stat-card inprogress">
          <div className="stat-label">⚡ In Progress</div>
          <div className="stat-value">{stats?.inProgress ?? 0}</div>
        </div>
        <div className="stat-card done">
          <div className="stat-label">✅ Done</div>
          <div className="stat-value">{stats?.done ?? 0}</div>
        </div>
        <div className="stat-card overdue">
          <div className="stat-label">🔥 Overdue</div>
          <div className="stat-value">{stats?.overdue ?? 0}</div>
        </div>
        <div className="stat-card" style={{ borderColor: "#2a2a38" }}>
          <div className="stat-label">🎯 My Tasks</div>
          <div className="stat-value" style={{ color: "#f0f0ff" }}>
            {stats?.myTasks ?? 0}
          </div>
        </div>
        <div className="stat-card" style={{ borderColor: "#2a2a38" }}>
          <div className="stat-label">📁 Projects</div>
          <div className="stat-value" style={{ color: "#f0f0ff" }}>
            {projectList.length}
          </div>
        </div>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
      >
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Tasks</span>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setPage("tasks")}
            >
              View all →
            </button>
          </div>
          {recentTasks.length === 0 ? (
            <div className="empty-state" style={{ padding: "30px" }}>
              <div className="empty-icon">📭</div>
              <div className="empty-text">No tasks yet</div>
            </div>
          ) : (
            <div>
              {recentTasks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: isOverdue(t) ? "var(--overdue)" : "var(--text)",
                      }}
                    >
                      {t.title}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--muted)",
                        marginTop: "2px",
                      }}
                    >
                      {t.assigneeName || "Unassigned"}
                    </div>
                  </div>
                  <span
                    className={`badge badge-${t.status === "in-progress" ? "inprogress" : t.status}`}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Projects</span>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setPage("projects")}
            >
              View all →
            </button>
          </div>
          {projectList.length === 0 ? (
            <div className="empty-state" style={{ padding: "30px" }}>
              <div className="empty-icon">📂</div>
              <div className="empty-text">No projects yet</div>
            </div>
          ) : (
            <div>
              {projectList.map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontSize: "13px", fontWeight: 600 }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                      {p.taskCount} tasks
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", gap: "12px", marginTop: "6px" }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: "4px",
                        background: "var(--border)",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: p.taskCount
                            ? `${Math.round(((p.taskCount - p.overdueCount) / p.taskCount) * 100)}%`
                            : "0%",
                          background: "var(--accent)",
                          borderRadius: "2px",
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--muted)",
                      marginTop: "4px",
                    }}
                  >
                    {p.memberCount} members ·{" "}
                    {p.overdueCount > 0 ? (
                      <span style={{ color: "var(--overdue)" }}>
                        {p.overdueCount} overdue
                      </span>
                    ) : (
                      "No overdue"
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
