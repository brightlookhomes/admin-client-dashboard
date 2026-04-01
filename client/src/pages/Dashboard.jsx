import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import http from "../api/http.js";
import { FiFolder, FiActivity, FiCheckCircle, FiDollarSign } from "react-icons/fi";
import "./Dashboard.css";

// Modularized Components
import ProjectCard from "../components/dashboard/ProjectCard.jsx";
import ProjectFormModal from "../components/dashboard/ProjectFormModal.jsx";

function formatCurrencyINR(value) {
  const n = Number(value || 0);
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function fetchProjects() {
    try {
      setLoading(true);
      const { data } = await http.get("/projects");
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((p) => p.status !== "Completed").length;
    const completed = projects.filter((p) => p.status === "Completed").length;
    const totalRevenue = projects.reduce(
      (sum, p) => sum + Number(p.totalReceived || 0),
      0
    );

    return [
      { label: "Total Projects", value: String(total), icon: <FiFolder size={24} /> },
      { label: "Active Projects", value: String(active), icon: <FiActivity size={24} /> },
      { label: "Completed", value: String(completed), icon: <FiCheckCircle size={24} /> },
      { label: "Total Received", value: formatCurrencyINR(totalRevenue), accent: true, icon: <FiDollarSign size={26} /> },
    ];
  }, [projects]);

  const hasProjects = projects.length > 0;

  return (
    <div className="dashboard">
      <header className="dashboardHeader">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/logo.png" alt="Brightlook Homes" className="brandLogo" />
          <h1 className="dashboardTitle">Admin Dashboard</h1>
        </div>
      </header>

      <section className="dashboardStatsRow">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className={`statCard${stat.accent ? " statCard--accent" : ""}`}
            style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}
          >
            <div>
              <div className="statValue">{stat.value}</div>
              <div className="statLabel">{stat.label}</div>
            </div>
            <div style={{ color: stat.accent ? 'var(--c-green)' : 'var(--c-gray-700)', opacity: 0.8 }}>
              {stat.icon}
            </div>
          </article>
        ))}
      </section>

      <section className="dashboardActionsRow">
        <button
          type="button"
          className="newProjectButton"
          onClick={() => {
            setEditingProject(null);
            setIsModalOpen(true);
          }}
        >
          + New Project
        </button>
      </section>

      <section className="dashboardProjects">
        <div className={`projectsGrid${hasProjects ? "" : " projectsGrid--empty"}`}>
          {loading ? (
            <div className="projectEmptyCard">
              <p className="projectEmptyTitle">Loading…</p>
            </div>
          ) : hasProjects ? (
            projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onOpen={() => navigate(`/project/${project._id}`)}
                onEdit={() => {
                  setEditingProject(project);
                  setIsModalOpen(true);
                }}
                onDelete={async () => {
                  const ok = window.confirm("Delete this project?");
                  if (!ok) return;
                  try {
                    await http.delete(`/projects/${project._id}`);
                    toast.success("Project deleted");
                    fetchProjects();
                  } catch {
                    toast.error("Failed to delete project");
                  }
                }}
              />
            ))
          ) : (
            <div className="projectEmptyCard">
              <p className="projectEmptyTitle">No projects yet</p>
              <p className="projectEmptySubtitle">
                Click &quot;+ New Project&quot; to create your first project.
              </p>
            </div>
          )}
        </div>
      </section>

      {isModalOpen && (
        <ProjectFormModal
          initial={editingProject}
          onClose={() => setIsModalOpen(false)}
          onSaved={() => {
            setIsModalOpen(false);
            setEditingProject(null);
            fetchProjects();
          }}
        />
      )}
    </div>
  );
}
