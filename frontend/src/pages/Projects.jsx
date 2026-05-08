import { useEffect, useState } from "react";
import { projects, users } from "../api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  Plus,
  Users,
  CheckSquare,
  AlertTriangle,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";

function ProjectModal({ onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || { name: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error("Project name required");
    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 className="modal-title" style={{ margin: 0 }}>
            {initial ? "Edit Project" : "New Project"}
          </h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name</label>
            <input
              className="form-control"
              placeholder="e.g. Website Redesign"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="What is this project about?"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              style={{ resize: "vertical" }}
            />
          </div>
          <div
            style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
          >
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner" />
              ) : initial ? (
                "Save Changes"
              ) : (
                "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MembersModal({ project, onClose }) {
  const [allUsers, setAllUsers] = useState([]);
  const [members, setMembers] = useState(project.members || []);

  useEffect(() => {
    users
      .getAll()
      .then((r) => setAllUsers(r.data))
      .catch(() => {});
  }, []);

  const addMember = async (userId) => {
    try {
      await projects.addMember(project.id, userId);
      const user = allUsers.find((u) => u.id === userId);
      setMembers((prev) => [...prev, user]);
      toast.success("Member added");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed");
    }
  };

  const removeMember = async (userId) => {
    try {
      await projects.removeMember(project.id, userId);
      setMembers((prev) => prev.filter((m) => m.id !== userId));
      toast.success("Member removed");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed");
    }
  };

  const nonMembers = allUsers.filter(
    (u) => !members.find((m) => m.id === u.id),
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 className="modal-title" style={{ margin: 0 }}>
            Manage Members — {project.name}
          </h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              fontSize: "12px",
              color: "var(--muted)",
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Current Members
          </div>
          {members.length === 0 && (
            <div style={{ color: "var(--muted)", fontSize: "13px" }}>
              No members yet
            </div>
          )}
          {members.map((m) => (
            <div
              key={m.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  className="user-avatar"
                  style={{ width: 28, height: 28, fontSize: 11 }}
                >
                  {m.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 500 }}>
                    {m.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                    {m.email}
                  </div>
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span className={`badge badge-${m.role}`}>{m.role}</span>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeMember(m.id)}
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {nonMembers.length > 0 && (
          <div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--muted)",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Add Members
            </div>
            {nonMembers.map((u) => (
              <div
                key={u.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 500 }}>
                    {u.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                    {u.email}
                  </div>
                </div>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => addMember(u.id)}
                >
                  <UserPlus size={12} /> Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const { user } = useAuth();
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [membersProject, setMembersProject] = useState(null);

  const isAdmin = user?.role === "admin";

  const load = () => {
    projects
      .getAll()
      .then((r) => {
        setProjectList(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (form) => {
    const res = await projects.create(form);
    setProjectList((prev) => [
      ...prev,
      { ...res.data, memberCount: 1, taskCount: 0, overdueCount: 0 },
    ]);
    toast.success("Project created!");
  };

  const handleEdit = async (form) => {
    const res = await projects.update(editProject.id, form);
    setProjectList((prev) =>
      prev.map((p) => (p.id === editProject.id ? { ...p, ...res.data } : p)),
    );
    setEditProject(null);
    toast.success("Project updated!");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project and all its tasks?")) return;
    await projects.delete(id);
    setProjectList((prev) => prev.filter((p) => p.id !== id));
    toast.success("Project deleted");
  };

  const openMembers = async (proj) => {
    const res = await projects.getOne(proj.id);
    setMembersProject(res.data);
  };

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
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">
            {projectList.length} project{projectList.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        </div>
        {isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      {projectList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <div className="empty-title">No projects yet</div>
          <div className="empty-text">
            {isAdmin
              ? "Create your first project to get started"
              : "You have not been added to any projects yet"}
          </div>
        </div>
      ) : (
        <div className="projects-grid">
          {projectList.map((p) => (
            <div key={p.id} className="project-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "8px",
                }}
              >
                <div className="project-name">{p.name}</div>
                {isAdmin && (
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setEditProject(p);
                      }}
                      style={{ padding: "4px 8px" }}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(p.id)}
                      style={{ padding: "4px 8px" }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
              <p className="project-desc">
                {p.description || "No description"}
              </p>
              <div className="project-meta">
                <span>
                  <Users size={12} /> {p.memberCount} members
                </span>
                <span>
                  <CheckSquare size={12} /> {p.taskCount} tasks
                </span>
                {p.overdueCount > 0 && (
                  <span style={{ color: "var(--overdue)" }}>
                    <AlertTriangle size={12} /> {p.overdueCount} overdue
                  </span>
                )}
              </div>
              {isAdmin && (
                <button
                  className="btn btn-ghost btn-sm"
                  style={{
                    marginTop: "12px",
                    width: "100%",
                    justifyContent: "center",
                  }}
                  onClick={() => openMembers(p)}
                >
                  <UserPlus size={13} /> Manage Members
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ProjectModal
          onClose={() => setShowModal(false)}
          onSave={handleCreate}
        />
      )}
      {editProject && (
        <ProjectModal
          onClose={() => setEditProject(null)}
          onSave={handleEdit}
          initial={editProject}
        />
      )}
      {membersProject && (
        <MembersModal
          project={membersProject}
          onClose={() => setMembersProject(null)}
        />
      )}
    </div>
  );
}
