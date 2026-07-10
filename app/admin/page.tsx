"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ApplicationData {
  id: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    country: string;
    city: string;
  };
  creatorProfile: {
    handle: string;
    niche: string;
    platforms: string[];
    followerCount: string;
    avgViews: string;
    profileLinks: string[];
  };
  participationPreferences: {
    panel: boolean;
    meetAndGreet: boolean;
    collabs: boolean;
    brandDeals: boolean;
    liveChallenges: boolean;
  };
  additionalDetails: {
    bio: string;
    previousEventExperience: string;
    referralSource: string;
  };
  consents: {
    termsAndConditions: boolean;
    mediaConsent: boolean;
    newsletter: boolean;
  };
  createdAt?: string;
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [nicheFilter, setNicheFilter] = useState("");
  const [selectedApp, setSelectedApp] = useState<ApplicationData | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/applications");
      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }
      const data = await response.json();
      setApplications(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while loading data.");
    } finally {
      setLoading(false);
    }
  }

  // Derived metrics for stats cards
  const totalCount = applications.length;
  
  // Find top content niche
  const nicheCounts: Record<string, number> = {};
  applications.forEach((app) => {
    const niche = app.creatorProfile?.niche;
    if (niche) {
      nicheCounts[niche] = (nicheCounts[niche] || 0) + 1;
    }
  });
  let topNiche = "N/A";
  let maxNicheCount = 0;
  Object.entries(nicheCounts).forEach(([niche, count]) => {
    if (count > maxNicheCount) {
      maxNicheCount = count;
      topNiche = niche;
    }
  });

  // Find top platform
  const platformCounts: Record<string, number> = {};
  applications.forEach((app) => {
    const platforms = app.creatorProfile?.platforms || [];
    platforms.forEach((platform) => {
      platformCounts[platform] = (platformCounts[platform] || 0) + 1;
    });
  });
  let topPlatform = "N/A";
  let maxPlatformCount = 0;
  Object.entries(platformCounts).forEach(([platform, count]) => {
    if (count > maxPlatformCount) {
      maxPlatformCount = count;
      topPlatform = platform;
    }
  });

  // Filter applications list
  const filteredApplications = applications.filter((app) => {
    const name = app.personalInfo?.name || "";
    const email = app.personalInfo?.email || "";
    const handle = app.creatorProfile?.handle || "";
    const niche = app.creatorProfile?.niche || "";

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      handle.toLowerCase().includes(search.toLowerCase());

    const matchesNiche = nicheFilter === "" || niche === nicheFilter;

    return matchesSearch && matchesNiche;
  });

  // Available unique niches for filter dropdown
  const uniqueNiches = Array.from(
    new Set(applications.map((app) => app.creatorProfile?.niche).filter(Boolean))
  );

  return (
    <div className="admin-page">
      {/* HEADER */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            Creator <span>Directory</span>
          </h1>
          <p className="admin-sub">
            Review and manage incoming creator registration applications.
          </p>
        </div>
        <Link href="/" className="btn-ghost" style={{ padding: "0.6rem 1.5rem" }}>
          ← Back to Website
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="admin-stats">
        <div className="stats-card">
          <div className="stats-lbl">Total Registrations</div>
          <div className="stats-val">{totalCount}</div>
          <div className="stats-desc">Pending review</div>
        </div>
        <div className="stats-card">
          <div className="stats-lbl">Top Content Niche</div>
          <div className="stats-val">{topNiche}</div>
          <div className="stats-desc">
            {maxNicheCount > 0 ? `${maxNicheCount} applications` : "No niche data"}
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-lbl">Primary Platform</div>
          <div className="stats-val">
            {topPlatform === "N/A"
              ? "N/A"
              : topPlatform.charAt(0).toUpperCase() + topPlatform.slice(1)}
          </div>
          <div className="stats-desc">
            {maxPlatformCount > 0 ? `${maxPlatformCount} creators` : "No platform data"}
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="admin-controls">
        <input
          type="text"
          placeholder="Search by name, email, or @handle..."
          className="admin-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="admin-filter"
          value={nicheFilter}
          onChange={(e) => setNicheFilter(e.target.value)}
        >
          <option value="">All Content Niches</option>
          {uniqueNiches.map((niche) => (
            <option key={niche} value={niche}>
              {niche}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={fetchApplications}
          className="btn-ghost"
          style={{ padding: "0.75rem 1.25rem", borderRadius: "8px" }}
          aria-label="Refresh list"
        >
          ↻ Refresh
        </button>
      </div>

      {/* LOADING & ERROR STATES */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "5rem 2rem",
            background: "var(--c-card)",
            borderRadius: "16px",
            border: "1px solid var(--c-border)",
          }}
        >
          <div className="stats-lbl" style={{ animation: "fadeUp 1.2s infinite" }}>
            Fetching application documents...
          </div>
        </div>
      ) : error ? (
        <div
          style={{
            textAlign: "center",
            padding: "5rem 2rem",
            background: "var(--c-card)",
            borderRadius: "16px",
            border: "1px solid var(--c-border)",
          }}
        >
          <div className="stats-lbl" style={{ color: "var(--c-accent)" }}>
            Error loading applications
          </div>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>{error}</p>
          <button
            type="button"
            onClick={fetchApplications}
            className="btn-primary"
            style={{ marginTop: "1.5rem", padding: "0.6rem 1.5rem" }}
          >
            Try Again
          </button>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "5rem 2rem",
            background: "var(--c-card)",
            borderRadius: "16px",
            border: "1px solid var(--c-border)",
          }}
        >
          <div className="stats-lbl">No Applications Found</div>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "var(--c-text-secondary)" }}>
            {totalCount === 0
              ? "We haven't received any creator applications yet."
              : "No records match your search criteria."}
          </p>
        </div>
      ) : (
        /* APPLICATIONS DIRECTORY TABLE */
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Creator Name</th>
                <th>Handle</th>
                <th>Content Niche</th>
                <th>Followers</th>
                <th>Platform(s)</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id} onClick={() => setSelectedApp(app)}>
                  <td style={{ fontWeight: 600 }}>{app.personalInfo?.name}</td>
                  <td style={{ color: "var(--c-accent2)", fontFamily: "monospace" }}>
                    {app.creatorProfile?.handle}
                  </td>
                  <td>
                    <span className="badge niche">{app.creatorProfile?.niche}</span>
                  </td>
                  <td>{app.creatorProfile?.followerCount}</td>
                  <td>
                    {app.creatorProfile?.platforms?.map((platform) => (
                      <span
                        key={platform}
                        className={`badge ${platform.toLowerCase()}`}
                      >
                        {platform}
                      </span>
                    )) || "N/A"}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button type="button" className="admin-view-btn">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DETAILED DIALOG MODAL */}
      <div
        className={`details-modal-overlay${selectedApp ? " open" : ""}`}
        onClick={() => setSelectedApp(null)}
      >
        <div
          className="details-modal-card"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => setSelectedApp(null)}
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {selectedApp && (
            <>
              <h2 className="admin-title" style={{ fontSize: "2.2rem" }}>
                Creator <span>Profile Details</span>
              </h2>
              <p
                className="admin-sub"
                style={{ fontFamily: "monospace", color: "var(--c-accent2)" }}
              >
                ID: {selectedApp.id}
              </p>

              <div className="details-grid">
                {/* Section: Personal Info */}
                <div className="details-group">
                  <label>Full Name</label>
                  <p style={{ fontWeight: 600 }}>{selectedApp.personalInfo?.name}</p>
                </div>
                <div className="details-group">
                  <label>Email Address</label>
                  <a href={`mailto:${selectedApp.personalInfo?.email}`}>
                    {selectedApp.personalInfo?.email}
                  </a>
                </div>
                <div className="details-group">
                  <label>Phone Number</label>
                  <p>{selectedApp.personalInfo?.phone || "N/A"}</p>
                </div>
                <div className="details-group">
                  <label>Location</label>
                  <p>
                    {selectedApp.personalInfo?.city || "N/A"},{" "}
                    {selectedApp.personalInfo?.country}
                  </p>
                </div>

                <div className="details-full-width">
                  <hr className="form-divider" style={{ margin: "0.5rem 0" }} />
                </div>

                {/* Section: Creator profile */}
                <div className="details-group">
                  <label>Handle</label>
                  <p style={{ color: "var(--c-accent2)", fontWeight: 600 }}>
                    {selectedApp.creatorProfile?.handle}
                  </p>
                </div>
                <div className="details-group">
                  <label>Niche</label>
                  <p>{selectedApp.creatorProfile?.niche}</p>
                </div>
                <div className="details-group">
                  <label>Total Followers</label>
                  <p>{selectedApp.creatorProfile?.followerCount}</p>
                </div>
                <div className="details-group">
                  <label>Average Views</label>
                  <p>{selectedApp.creatorProfile?.avgViews || "N/A"}</p>
                </div>
                
                <div className="details-group details-full-width">
                  <label>Social Platforms</label>
                  <div style={{ marginTop: "0.25rem" }}>
                    {selectedApp.creatorProfile?.platforms?.map((p) => (
                      <span key={p} className={`badge ${p.toLowerCase()}`}>
                        {p}
                      </span>
                    )) || "N/A"}
                  </div>
                </div>

                {selectedApp.creatorProfile?.profileLinks &&
                  selectedApp.creatorProfile.profileLinks.length > 0 && (
                    <div className="details-group details-full-width">
                      <label>Channel / Social Links</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginTop: "0.25rem" }}>
                        {selectedApp.creatorProfile.profileLinks.map((link, idx) => (
                          <a key={idx} href={link} target="_blank" rel="noopener noreferrer">
                            {link}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                <div className="details-full-width">
                  <hr className="form-divider" style={{ margin: "0.5rem 0" }} />
                </div>

                {/* Section: Bio & Preferences */}
                <div className="details-group details-full-width">
                  <label>Creator Bio & Purpose</label>
                  <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                    {selectedApp.additionalDetails?.bio}
                  </p>
                </div>

                {selectedApp.additionalDetails?.previousEventExperience && (
                  <div className="details-group details-full-width">
                    <label>Previous Event Experience</label>
                    <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                      {selectedApp.additionalDetails.previousEventExperience}
                    </p>
                  </div>
                )}

                <div className="details-group">
                  <label>Referral Source</label>
                  <p>{selectedApp.additionalDetails?.referralSource || "N/A"}</p>
                </div>

                <div className="details-group">
                  <label>Event Preferences</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginTop: "0.25rem" }}>
                    {selectedApp.participationPreferences?.panel && (
                      <span className="badge">Hosting Panel</span>
                    )}
                    {selectedApp.participationPreferences?.meetAndGreet && (
                      <span className="badge">Meet & Greet</span>
                    )}
                    {selectedApp.participationPreferences?.collabs && (
                      <span className="badge">Collaborations</span>
                    )}
                    {selectedApp.participationPreferences?.brandDeals && (
                      <span className="badge">Brand Deals</span>
                    )}
                    {selectedApp.participationPreferences?.liveChallenges && (
                      <span className="badge">Live Challenges</span>
                    )}
                  </div>
                </div>

                <div className="details-full-width">
                  <hr className="form-divider" style={{ margin: "0.5rem 0" }} />
                </div>

                {/* Consents */}
                <div className="details-group details-full-width">
                  <label>Consents & Consents Status</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.25rem" }}>
                    <span className="badge" style={{ borderColor: "#16a34a", color: "#22c55e" }}>
                      ✓ Terms Agreed
                    </span>
                    <span
                      className="badge"
                      style={{
                        borderColor: selectedApp.consents?.mediaConsent ? "#16a34a" : "var(--c-border)",
                        color: selectedApp.consents?.mediaConsent ? "#22c55e" : "var(--c-muted)",
                      }}
                    >
                      {selectedApp.consents?.mediaConsent ? "✓ Media Consent Given" : "✗ No Media Consent"}
                    </span>
                    <span
                      className="badge"
                      style={{
                        borderColor: selectedApp.consents?.newsletter ? "#16a34a" : "var(--c-border)",
                        color: selectedApp.consents?.newsletter ? "#22c55e" : "var(--c-muted)",
                      }}
                    >
                      {selectedApp.consents?.newsletter ? "✓ Subscribed to Newsletter" : "✗ No Newsletter"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
