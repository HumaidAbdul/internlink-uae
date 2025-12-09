// src/pages/UserProfile.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';

import ChangePassword from './ChangePassword';

// Base URL (strip trailing /api and slashes)
const API_ORIGIN = (process.env.REACT_APP_API_BASE || 'http://localhost:5001')
  .replace(/\/api\/?$/i, '')
  .replace(/\/+$/, '');

// Inline SVG fallback avatar (no external request)
const FALLBACK_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
       <rect width="80" height="80" rx="40" fill="#f3f4f6"/>
       <circle cx="40" cy="32" r="14" fill="#d1d5db"/>
       <path d="M20 60c0-10 20-10 20-10s20 0 20 10v4H20z" fill="#d1d5db"/>
     </svg>`
  );

// Turn whatever DB stores into a valid URL
const fileUrl = (rel) => {
  if (!rel) return null;
  // External URLs (Drive/S3) untouched
  if (/^https?:\/\//i.test(rel)) return String(rel).trim();

  // Remove accidental origin, fix slashes, trim
  let p = String(rel).trim()
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/\\/g, '/')
    .replace(/^\/+/, '');

  // Ensure uploads/ prefix
  if (!/^uploads\//i.test(p)) p = `uploads/${p}`;

  return `${API_ORIGIN}/${p}`;
};

export default function UserProfile() {
  const nav = useNavigate();
  const [profile, setProfile] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const [pRes, aRes] = await Promise.all([
          api.get('/api/student/dashboard'),
          api.get('/api/student/applications'),
        ]);
        if (!on) return;
        setProfile(pRes?.data?.profile || pRes?.data || null);
        const arr = Array.isArray(aRes?.data?.applications)
          ? aRes.data.applications
          : (aRes?.data || []);
        setApps(arr);
      } catch (e) {
        console.error(e);
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => { on = false; };
  }, []);

  const totalApplied  = apps.length;
  const totalApproved = useMemo(
    () => apps.filter(a => String(a.status || '').toLowerCase().includes('approve')).length,
    [apps]
  );

  if (loading) return null;
  if (!profile) return <div className="sd card">Couldn’t load your profile.</div>;

  const photo = fileUrl(profile.profile_image);

 const cv = fileUrl(profile.cv_link)?.replace('http://localhost:5000', 'http://localhost:5001');


  const handleImgError = (e) => {
    // prevent infinite error loops
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_AVATAR;
  };

  return (
    <div className="sd">
      {/* page-scoped styles */}
      <style>{`
        .sd{ --bg:#f5f7fb; --card:#fff; --br:#e6e8ee; --ink:#0b1020; --muted:#6b7280; --brand:#2563eb; --ok:#16a34a; --warn:#eab308; --bad:#dc2626;
              min-height:100svh; background:var(--bg); color:var(--ink); font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif; }
        .sd .wrap{ max-width:1150px; margin:24px auto; padding:0 16px; }

        .sd .top{ display:grid; gap:16px; grid-template-columns:1fr; }
        @media (min-width:970px){ .sd .top{ grid-template-columns: 1.2fr 1fr 1fr; } }

        .sd .card{ background:var(--card); border:1px solid var(--br); border-radius:12px; box-shadow:0 10px 22px rgba(25,35,60,.05); }
        .sd .p6{ padding:16px; }
        .sd .row{ display:flex; align-items:center; gap:14px; }
        .sd .avatar{ width:64px; height:64px; border-radius:50%; object-fit:cover; border:1px solid var(--br); background:#f3f4f6; }

        .sd .title{ margin:0; font-weight:700; font-size:18px; }
        .sd .muted{ color:var(--muted); font-size:14px; }

        .sd .btn{ display:inline-block; padding:8px 12px; border-radius:10px; border:1px solid #cdd5ea; background:#fff; font-weight:600; cursor:pointer; }
        .sd .btnPrimary{ background:var(--brand); color:#fff; border-color:transparent; }
        .sd .btnSmall{ padding:6px 10px; font-size:14px; color: black }

        .sd .kpi{ display:flex; align-items:center; justify-content:center; gap:10px; min-height:92px; }
        .sd .kpi .num{ font-size:28px; font-weight:800; }
        .sd .kpi .label{ color:var(--muted); font-weight:600; }

        .sd .section{ margin-top:18px; }
        .sd .sectionTitle{ display:flex; align-items:center; justify-content:space-between; margin:0 0 8px; font-size:16px; font-weight:700; }

        /* Table */
        .sd .tblWrap{ background:var(--card); border:1px solid var(--br); border-radius:12px; box-shadow:0 10px 22px rgba(25,35,60,.05); overflow:auto; }
        .sd table{ width:100%; border-collapse:separate; border-spacing:0; }
        .sd thead th{ text-align:left; font-size:13px; color:var(--muted); font-weight:700; padding:12px 14px; border-bottom:1px solid var(--br); white-space:nowrap; background:#fafbff; }
        .sd tbody td{ padding:12px 14px; border-bottom:1px solid var(--br); font-size:14px; }
        .sd tbody tr:last-child td{ border-bottom:0; }

        .sd .badge{ display:inline-flex; align-items:center; gap:6px; padding:6px 10px; border-radius:999px; font-weight:700; font-size:12px; }
        .sd .b-ok{ background:#e8f7ee; color:#166534; }
        .sd .b-warn{ background:#fff7db; color:#854d0e; }
        .sd .b-bad{ background:#fee2e2; color:#7f1d1d; }
        .sd .view{ color:var(--brand); text-decoration:none; font-weight:600; }
        .sd .view:hover{ text-decoration:underline; }
      `}</style>

      <div className="wrap">
        {/* TOP ROW */}
        <div className="top">
          {/* Profile card */}
          <section className="card p6">
            <div className="row">
              <img
                className="avatar"
                src={photo || FALLBACK_AVATAR}
                alt="User avatar"
                onError={handleImgError}
              />
              <div>
                <h2 className="title">{profile.name}</h2>
                <div className="muted" style={{marginBottom:6}}>{profile.email}</div>
                <div className="muted"><strong>University:</strong> {profile.university || '—'}</div>
                <div className="muted"><strong>Major:</strong> {profile.major || '—'}</div>
              </div>
            </div>

            <div style={{marginTop:10, display:'flex', gap:8, flexWrap:'wrap'}}>
              <button className="btn btnSmall" onClick={() => nav('/profile/student/edit')}>Edit Profile</button>
              <button className='btn btnSmall' onClick={() => nav('/profile/student/password')}>Change Password</button>
              {profile.cv_link && (
                <a className="btn btnPrimary btnSmall" href={cv} target="_blank" rel="noreferrer">View CV</a>
              )}
            </div>
          </section>

          {/* KPI: Applied */}
          <section className="card p6 kpi">
            <div className="num">{totalApplied}</div>
            <div className="label">Applied</div>
          </section>

          {/* KPI: Approved */}
          <section className="card p6 kpi">
            <div className="num">{totalApproved}</div>
            <div className="label">Approved</div>
          </section>
        </div>

        {/* APPLIED TABLE */}
        <div className="section">
          <div className="sectionTitle">
            <span>🔎 Applied Internships</span>
          </div>

          <div className="tblWrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>Rejection reason</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {apps.length === 0 ? (
                  <tr><td colSpan="6" className="muted">No applications yet.</td></tr>
                ) : (
                  apps.map(a => {
                    const status = String(a.status || '').toLowerCase();
                    const badgeClass =
                      status.includes('approve') ? 'b-ok' :
                      status.includes('pend')    ? 'b-warn' : 'b-bad';
                    return (
                      <tr key={a.application_id || a.id}>
                        <td><strong>{a.title}</strong></td>
                        <td>{a.location || '—'}</td>
                        <td>
                          <span className={`badge ${badgeClass}`}>
                            {a.status || '—'}
                          </span>
                        </td>
                        <td>{a.applied_at ? new Date(a.applied_at).toLocaleDateString() : '—'}</td>
                        <td>{a.rejection_reason || '—'}</td>
                        <td>
                          {a.internship_id ? (
                            <Link className="view" to={`/internships/${a.internship_id}`}>View</Link>
                          ) : (
                            <span className="muted">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
