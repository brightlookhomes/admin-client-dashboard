import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import http from "../api/http.js";
import "./Project.css";

// Modularized Components
import AddSiteUpdateModal from "../components/project/AddSiteUpdateModal.jsx";
import AddMilestoneModal from "../components/project/AddMilestoneModal.jsx";
import AddPaymentModal from "../components/project/AddPaymentModal.jsx";
import FullMediaViewer from "../components/project/FullMediaViewer.jsx";

function formatCurrencyINR(value) {
  const n = Number(value || 0);
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatSimpleDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function formatDate(value) { return formatSimpleDate(value); }


export default function Project() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("work");
  
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null); // { url, type }

  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

  async function fetchBundle() {
    try {
      setLoading(true);
      const { data } = await http.get(`/public/projects/${id}`);
      setBundle(data);
    } catch {
      toast.error("Failed to load project details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    document.title = "Brightlook Admin";
    fetchBundle();
    
    function onKeyDown(e) {
      if (e.key !== "Escape") return;
      setIsAddUpdateOpen(false);
      setIsAddMilestoneOpen(false);
      setIsAddPaymentOpen(false);
      setSelectedMedia(null);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [id]);

  if (loading && !bundle) {
    return <div className="projectPage">Loading...</div>;
  }

  if (!bundle?.project) {
    return <div className="projectPage">Project not found</div>;
  }

  const { project, updates, milestones, payments, totals } = bundle;
  const shareLink = `${window.location.origin}/client/${id}`;

  const handleDeleteProject = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await http.delete(`/projects/${id}`);
      toast.success("Project deleted");
      navigate("/dashboard");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const deleteUpdate = async (updateId) => {
    if (!window.confirm("Delete this update?")) return;
    try {
      await http.delete(`/updates/${updateId}`);
      toast.success("Update deleted");
      fetchBundle();
    } catch {
      toast.error("Failed to delete update");
    }
  };

  const deleteMilestone = async (milestoneId) => {
    if (!window.confirm("Delete this milestone?")) return;
    try {
      await http.delete(`/milestones/${milestoneId}`);
      toast.success("Milestone deleted");
      fetchBundle();
    } catch {
      toast.error("Failed to delete milestone");
    }
  };

  const toggleMilestone = async (milestone) => {
    const originalStatus = milestone.completed;
    const newStatus = !originalStatus;

    // 1. Optimistic UI update
    setBundle((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        milestones: prev.milestones.map((m) =>
          m._id === milestone._id ? { ...m, completed: newStatus } : m
        ),
      };
    });

    try {
      // 2. Persist to server
      await http.put(`/milestones/${milestone._id}`, { completed: newStatus });
    } catch (error) {
      // 4. Rollback on failure
      setBundle((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          milestones: prev.milestones.map((m) =>
            m._id === milestone._id ? { ...m, completed: originalStatus } : m
          ),
        };
      });
      toast.error("Failed to toggle milestone status");
    }
  };

  const deletePayment = async (paymentId) => {
    if (!window.confirm("Delete this payment?")) return;
    try {
      await http.delete(`/payments/${paymentId}`);
      toast.success("Payment deleted");
      fetchBundle();
    } catch {
      toast.error("Failed to delete payment");
    }
  };

  return (
    <div className="projectPage">
      <header className="projectHeader">
        <button
          type="button"
          className="projectBackButton"
          onClick={() => navigate("/dashboard")}
        >
          ← Back
        </button>

        <div className="projectHeaderMain" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src="/logo.png" className="brandLogo" alt="Brightlook Homes Logo" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h1 className="projectTitle">{project.name}</h1>
            <p className="projectClient">{project.clientName}</p>
          </div>
        </div>

        <div className="projectHeaderActions">
          <button type="button" className="projectDeleteButton" onClick={handleDeleteProject}>
            Delete Project
          </button>
        </div>
      </header>

      <section className="projectSummaryCard">
        <div className="projectSummaryRow">
          <div className="projectSummaryItem">
            <div className="projectSummaryLabel">Phone</div>
            <div className="projectSummaryValue">{project.phone || "—"}</div>
          </div>
          <div className="projectSummaryItem">
            <div className="projectSummaryLabel">Location</div>
            <div className="projectSummaryValue">{project.location || "—"}</div>
          </div>
          <div className="projectSummaryItem">
            <div className="projectSummaryLabel">Start Date</div>
            <div className="projectSummaryValue">{formatDate(project.startDate)}</div>
          </div>
          <div className="projectSummaryItem">
            <div className="projectSummaryLabel">End Date</div>
            <div className="projectSummaryValue">{formatDate(project.endDate)}</div>
          </div>
          <div className="projectSummaryItem">
            <div className="projectSummaryLabel">Contract Value</div>
            <div className="projectSummaryValue">{formatCurrencyINR(project.contractValue)}</div>
          </div>
          <div className="projectSummaryItem">
            <div className="projectSummaryLabel">Total Received</div>
            <div className="projectSummaryValue" style={{ color: 'var(--c-blue)' }}>{formatCurrencyINR(totals?.totalReceived)}</div>
          </div>
        </div>

        <div className="projectProgressSection">
          <div className="projectProgressLabelRow">
            <span className="projectProgressTitle">Overall Progress</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="projectProgressPercent">
                {Math.round(project.overallProgress || 0)}%
              </span>
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', color: 'var(--c-blue)', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}
                onClick={async () => {
                  const newProg = window.prompt("Enter new overall progress (0-100):", project.overallProgress || 0);
                  if (newProg !== null) {
                    const num = parseInt(newProg, 10);
                    if (!isNaN(num) && num >= 0 && num <= 100) {
                      try {
                        await http.put(`/projects/${id}`, { overallProgress: num });
                        toast.success("Progress updated");
                        fetchBundle();
                      } catch {
                        toast.error("Failed to update progress");
                      }
                    } else {
                      toast.error("Please enter a valid number between 0 and 100");
                    }
                  }
                }}
              >
                Adjust
              </button>
            </div>
          </div>
          <div className="projectProgressTrack">
            <div
              className="projectProgressFill"
              style={{ width: `${Math.round(project.overallProgress || 0)}%` }}
            />
          </div>
        </div>

        <div className="projectShareRow">
          <div className="projectShareLabel">Client Shareable Link</div>
          <div className="projectShareInputRow">
            <input
              className="projectShareInput"
              type="text"
              readOnly
              value={shareLink}
            />
            <button
              type="button"
              className="projectShareCopyButton"
              onClick={() => {
                navigator.clipboard?.writeText(shareLink);
                toast.success("Link copied!");
              }}
            >
              Copy
            </button>
          </div>
        </div>
      </section>

      <section className="projectTabsSection">
        <div className="projectTabs">
          <button
            type="button"
            className={`projectTab${activeTab === "work" ? " projectTab--active" : ""}`}
            onClick={() => setActiveTab("work")}
          >
            Work Progress
          </button>
          <button
            type="button"
            className={`projectTab${activeTab === "milestones" ? " projectTab--active" : ""}`}
            onClick={() => setActiveTab("milestones")}
          >
            Milestones
          </button>
          <button
            type="button"
            className={`projectTab${activeTab === "payments" ? " projectTab--active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            Payments
          </button>
        </div>

        <div className="projectTabPanel">
          {activeTab === "work" && (
            <div className="projectTabContent">
              <div className="projectTabActionRow">
                <button type="button" className="projectAddButton" onClick={() => setIsAddUpdateOpen(true)}>
                  + Add Update
                </button>
              </div>

              {updates.length === 0 ? (
                <div className="projectSectionPlaceholder">No updates found.</div>
              ) : (
                <div className="projectList">
                  {updates.map((u) => (
                    <div key={u._id} className="projectListItem">
                      <div className="projectListItemHeader">
                        <div className="projectListItemHeaderInfo">
                          <strong className="projectListItemTitle">{u.title}</strong>
                          <span className="projectListItemDate">{formatDate(u.createdAt)}</span>
                        </div>
                        <button className="projectItemDeleteBtn" onClick={() => deleteUpdate(u._id)}>Delete</button>
                      </div>
                      {u.category && <div className="projectBadge">{u.category}</div>}
                      {u.description && <p className="projectListItemDesc">{u.description}</p>}
                      {u.media?.length > 0 && (
                        <div className="projectMediaRow">
                          {u.media.map((item, index) => {
                            const url = item.url;
                            const isVideo = url.toLowerCase().match(/\.(mp4|mov|webm|ogv)$/) || url.includes("/video/upload/");
                            return (
                              <div key={url} className="projectMediaThumbnail" onClick={() => {
                                const galleryItems = u.media.map(m => {
                                  const mUrl = m.url;
                                  const mIsVideo = mUrl.toLowerCase().match(/\.(mp4|mov|webm|ogv)$/) || mUrl.includes("/video/upload/");
                                  return { url: mUrl, type: mIsVideo ? 'video' : 'image', title: u.title, projectName: project.name, date: u.createdAt };
                                });
                                setSelectedMedia({ items: galleryItems, startIndex: index });
                              }}>
                                {isVideo ? <video src={url} className="thumbPreview" /> : <img src={url} className="thumbPreview" alt="update" />}
                                <div className="thumbOverlay">🔍</div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "milestones" && (
            <div className="projectTabContent">
              <div className="projectTabActionRow">
                <button type="button" className="projectAddButton" onClick={() => setIsAddMilestoneOpen(true)}>
                  + Add Milestone
                </button>
              </div>
              {milestones.length === 0 ? (
                <div className="projectSectionPlaceholder">No milestones found.</div>
              ) : (
                <div className="projectList">
                  {milestones.map((m) => (
                    <div key={m._id} className={`projectListItem${m.completed ? " projectListItem--completed" : ""}`}>
                      <div className="projectListItemHeader projectListItemHeader--full">
                        <div className="projectListItemGroup">
                          <input 
                            type="checkbox" 
                            checked={m.completed} 
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleMilestone(m);
                            }} 
                            className="projectCheckbox" 
                          />
                          <div className="projectMilestoneInfo">
                            <strong className="projectListItemTitle">{m.name}</strong>
                            {m.completed && <span className="projectMilestoneCompletedTag">✓ Completed</span>}
                          </div>
                          <span className="projectListItemDate" style={{marginLeft: 'auto', marginRight: '16px'}}>{formatDate(m.expectedDate)}</span>
                        </div>
                        <button className="projectItemDeleteBtn" onClick={() => deleteMilestone(m._id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "payments" && (
            <div className="projectTabContent">
              <div className="projectPaymentSummary">
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "12px", color: "var(--c-gray-700)" }}>Amount Received</div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--c-blue)" }}>{formatCurrencyINR(totals?.totalReceived)}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "12px", color: "var(--c-gray-700)" }}>Contract Amount</div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--c-black)" }}>{formatCurrencyINR(project.contractValue)}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "12px", color: "var(--c-gray-700)" }}>Pending Amount</div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "#cc0000" }}>{formatCurrencyINR(Number(project.contractValue || 0) - Number(totals?.totalReceived || 0))}</div>
                </div>
              </div>

              <div className="projectPaymentProgress">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "12px", color: "var(--c-gray-700)", fontWeight: "600" }}>
                  <span>Payment Progress</span>
                  <span style={{ fontWeight: "700", color: "var(--c-black)", fontSize: "14px" }}>
                    {project.contractValue ? Math.round((totals?.totalReceived || 0) / project.contractValue * 100) : 0}%
                  </span>
                </div>
                <div style={{ width: "100%", height: "12px", background: "var(--c-gray-300)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ 
                    height: "100%", 
                    background: "var(--c-green)", 
                    borderRadius: "999px", 
                    transition: "width 0.5s ease-out", 
                    width: `${project.contractValue ? Math.min(100, Math.round((totals?.totalReceived || 0) / project.contractValue * 100)) : 0}%` 
                  }} />
                </div>
              </div>

              <div className="projectTabActionRow">
                <button type="button" className="projectAddButton" onClick={() => setIsAddPaymentOpen(true)}>
                  + Add Payment
                </button>
              </div>
              {payments.length === 0 ? (
                <div className="projectSectionPlaceholder">No payments found.</div>
              ) : (
                <div className="projectList">
                   {payments.map((p) => (
                    <div key={p._id} className="projectListItem">
                      <div className="projectListItemHeader">
                        <div className="projectListItemHeaderInfo">
                          <strong className="projectListItemTitle projectListItemTitle--accent">{formatCurrencyINR(p.amount)}</strong> 
                          <span className="projectListItemDate">{formatDate(p.paidAt)}</span>
                        </div>
                        <button className="projectItemDeleteBtn" onClick={() => deletePayment(p._id)}>Delete</button>
                      </div>
                      {p.title && <p className="projectListItemDesc">{p.title}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {isAddUpdateOpen && <AddSiteUpdateModal projectId={id} onClose={() => setIsAddUpdateOpen(false)} onSaved={fetchBundle} />}
      {isAddMilestoneOpen && <AddMilestoneModal projectId={id} onClose={() => setIsAddMilestoneOpen(false)} onSaved={fetchBundle} />}
      {isAddPaymentOpen && <AddPaymentModal projectId={id} onClose={() => setIsAddPaymentOpen(false)} onSaved={fetchBundle} />}
      {selectedMedia && <FullMediaViewer media={selectedMedia} onClose={() => setSelectedMedia(null)} />}
    </div>
  );
}
