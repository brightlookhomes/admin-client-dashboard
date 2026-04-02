import { useEffect, useState, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import http from "../api/http.js";
import { FiCheck, FiCircle } from "react-icons/fi";

import "./ClientPortal.css";
// Reuse list styles and media viewer styles
import "./Project.css"; 

const FullMediaViewer = lazy(() => import("../components/project/FullMediaViewer.jsx"));

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

function formatISTDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).toUpperCase();
}

function formatDate(value) { return formatSimpleDate(value); }
function formatDateTime(value) { return formatISTDateTime(value); }

export default function ClientPortal() {
  const { projectId } = useParams();
  const [bundle, setBundle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("work");
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    async function fetchBundle() {
      try {
        setLoading(true);
        const { data } = await http.get(`/public/projects/${projectId}`);
        setBundle(data);
      } catch {
        toast.error("Failed to load project details");
      } finally {
        setLoading(false);
      }
    }
    document.title = "Brightlook Client";
    fetchBundle();
  }, [projectId]);

  if (loading && !bundle) {
    return (
      <div className="clientPortalPage" style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
        <h2>Loading portal...</h2>
      </div>
    );
  }

  if (!bundle?.project) {
    return (
      <div className="clientPortalPage" style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
        <h2>Project not found</h2>
      </div>
    );
  }

  const { project, updates, milestones, payments, totals } = bundle;

  // Use the most recent action for "last updated"
  let lastUpdated = project.updatedAt;
  
  if (updates?.length > 0) {
    for (const u of updates) {
      if (new Date(u.createdAt) > new Date(lastUpdated)) {
        lastUpdated = u.createdAt;
      }
    }
  }
  
  if (milestones?.length > 0) {
    for (const m of milestones) {
      if (m.updatedAt && new Date(m.updatedAt) > new Date(lastUpdated)) {
        lastUpdated = m.updatedAt;
      }
    }
  }

  return (
    <div className="clientPortalPage">
      <header className="clientPortalHeader">
        <div className="clientPortalLogo">
          <img src="/logo.png" className="brandLogo" alt="Brightlook Homes Logo" />
          <div className="cpLogoText">
            <span className="cpLogoTitle">Brightlook Homes</span>
            <span className="cpLogoSubtitle">Client Portal</span>
          </div>
        </div>
      </header>

      <div className="clientPortalBanner">
        <div className="clientPortalBannerContent">
          <h1 className="cpProjectName">{project.name}</h1>
          <div className="cpClientName">{project.clientName}</div>
          <div className="cpLocation">{project.location}</div>
          <div className="cpLastUpdated">Last Updated: {formatDateTime(lastUpdated)}</div>
        </div>
      </div>

      <main className="clientPortalMain">
        <div className="cpProgressCard">
          <div className="cpProgressTop">
            <span className="cpProgressTitle">Overall Progress</span>
            <span className="cpProgressPercent">{Math.round(project.overallProgress || 0)}%</span>
          </div>
          
          <div className="cpProgressTrack">
            <div
              className="cpProgressFill"
              style={{ width: `${Math.round(project.overallProgress || 0)}%` }}
            />
          </div>

          <div className="cpProgressDates">
            <div className="cpDateItem">
              <span className="cpDateLabel">Start Date</span>
              <span className="cpDateValue">{formatDate(project.startDate)}</span>
            </div>
            <div className="cpDateItem right">
              <span className="cpDateLabel">Expected End</span>
              <span className="cpDateValue">{formatDate(project.endDate)}</span>
            </div>
          </div>
        </div>

        <div className="cpTabsSection">
          <div className="cpTabsContainer">
            <div className="cpProjectTabs">
              <button
                type="button"
                className={`cpProjectTab${activeTab === "work" ? " cpProjectTab--active" : ""}`}
                onClick={() => setActiveTab("work")}
              >
                Work Progress
              </button>
              <button
                type="button"
                className={`cpProjectTab${activeTab === "milestones" ? " cpProjectTab--active" : ""}`}
                onClick={() => setActiveTab("milestones")}
              >
                Milestones
              </button>
              <button
                type="button"
                className={`cpProjectTab${activeTab === "payments" ? " cpProjectTab--active" : ""}`}
                onClick={() => setActiveTab("payments")}
              >
                Payments
              </button>
            </div>
          </div>
        </div>

        <div className="cpTabContent">
          {activeTab === "work" && (
            <div>
              <h2 className="cpSectionTitle">Site Updates</h2>
              
              {updates.length === 0 ? (
                <div className="projectSectionPlaceholder">No site updates yet.</div>
              ) : (
                <div className="cpList">
                  {updates.map((u) => (
                    <div key={u._id} className="projectListItem">
                      <div className="projectListItemHeader" style={{ display: 'block' }}>
                        <strong className="cpListItemTitle" style={{ display: 'block', marginBottom: '4px' }}>{u.title}</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="projectListItemDate">{formatSimpleDate(u.createdAt)}</span>
                          {u.category && <div className="projectBadge">{u.category}</div>}
                        </div>
                      </div>

                      {u.description && <p className="projectListItemDesc" style={{ marginTop: '8px' }}>{u.description}</p>}
                      
                      {u.media?.length > 0 && (
                        <div className={`cpMediaGrid cpGridCount-${Math.min(u.media.length, 5)}`}>
                          {u.media.slice(0, 4).map((item, index) => {
                            const url = item.url;
                            const isVideo = url.toLowerCase().match(/\.(mp4|mov|webm|ogv)$/) || url.includes("/video/upload/");
                            const isLast = index === 3;
                            const extraCount = u.media.length - 4;

                            return (
                              <div 
                                key={url} 
                                className={`cpMediaGridItem cpMediaGridItem-${index}`} 
                                onClick={() => {
                                  // Parse all media of this update 
                                  const galleryItems = u.media.map(m => {
                                    const mUrl = m.url;
                                    const mIsVideo = mUrl.toLowerCase().match(/\.(mp4|mov|webm|ogv)$/) || mUrl.includes("/video/upload/");
                                    return { 
                                      url: mUrl, 
                                      type: mIsVideo ? 'video' : 'image',
                                      projectName: project.name,
                                      title: u.title,
                                      date: u.createdAt
                                    };
                                  });
                                  setSelectedMedia({ items: galleryItems, startIndex: index });
                                }}
                              >
                                {isVideo ? (
                                  <video src={url} className="cpMediaGridImage" preload="metadata" />
                                ) : (
                                  <img src={url} className="cpMediaGridImage" alt="update" loading="lazy" />
                                )}
                                
                                {isVideo && <div className="cpMediaGridPlayIcon" />}
                                
                                {isLast && extraCount > 0 && (
                                  <div className="cpMediaGridCountOverlay">
                                    +{extraCount}
                                  </div>
                                )}
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
            <div>
              <h2 className="cpSectionTitle">Project Milestones</h2>
              {milestones.length === 0 ? (
                <div className="projectSectionPlaceholder">No milestones tracked.</div>
              ) : (
                <div className="cpList">
                  {milestones.map((m) => (
                    <div key={m._id} className="cpMilestoneCard">
                      <div className="cpMilestoneIcon" style={{ borderColor: m.completed ? 'var(--c-green)' : 'var(--c-gray-300)', color: m.completed ? 'var(--c-green)' : 'transparent', background: m.completed ? 'var(--c-green-bg)' : 'transparent' }}>
                        {m.completed ? <FiCheck size={14} /> : <FiCircle size={14} style={{ color: 'var(--c-gray-300)' }} />}
                      </div>
                      <div className="cpMilestoneInfo">
                        <span className={`cpMilestoneTitle ${m.completed ? 'cpMilestoneTitle--completed' : ''}`}>
                          {m.name}
                        </span>
                        {m.completed && (
                          <span className="cpMilestoneDate">
                            ✓ Completed: {formatDate(m.expectedDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "payments" && (
            <div>
              <div className="cpPaymentCardsRow">
                <div>
                  <div className="cpPaymentCardTitle">Contract Value</div>
                  <div className="cpPaymentCardValue cpPaymentValue--blue">{formatCurrencyINR(project.contractValue)}</div>
                </div>
                <div>
                  <div className="cpPaymentCardTitle">Amount Received</div>
                  <div className="cpPaymentCardValue cpPaymentValue--green">{formatCurrencyINR(totals?.totalReceived)}</div>
                </div>
                <div>
                  <div className="cpPaymentCardTitle">Pending Balance</div>
                  <div className="cpPaymentCardValue cpPaymentValue--red">{formatCurrencyINR(Number(project.contractValue || 0) - Number(totals?.totalReceived || 0))}</div>
                </div>
              </div>

              <div className="cpPaymentProgressCard">
                <div className="cpPaymentProgressTop">
                  <span>Payment Progress</span>
                  <span className="cpPaymentProgressPercent">
                    {project.contractValue ? ((totals?.totalReceived || 0) / project.contractValue * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="cpProgressTrack" style={{ marginBottom: 0 }}>
                  <div 
                    className="cpProgressFill cpProgressFill--green" 
                    style={{ width: `${project.contractValue ? Math.min(100, (totals?.totalReceived || 0) / project.contractValue * 100) : 0}%` }} 
                  />
                </div>
              </div>

              <h2 className="cpSectionTitle" style={{ marginTop: '0', marginBottom: '16px' }}>Payment History</h2>

              {payments.length === 0 ? (
                <div className="projectSectionPlaceholder">No payments logged.</div>
              ) : (
                <div className="cpList">
                    {payments.map((p) => (
                    <div key={p._id} className="cpPaymentHistoryCard">
                      <div className="cpPaymentHistoryAmount" style={{ color: 'var(--c-green)' }}>{formatCurrencyINR(p.amount)}</div>
                      {p.title && <div className="cpPaymentHistoryTitle">{p.title}</div>}
                      <div className="cpPaymentHistoryDate">{formatDate(p.paidAt)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Suspense fallback={null}>
        {selectedMedia && <FullMediaViewer media={selectedMedia} onClose={() => setSelectedMedia(null)} />}
      </Suspense>
    </div>
  );
}
