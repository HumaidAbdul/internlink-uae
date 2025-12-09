// src/pages/CompanyProfile.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import userIcon from './img/userImg.jpg'; // fallback avatar

const API_ORIGIN = (process.env.REACT_APP_API_BASE || 'http://localhost:5001')
  .replace(/\/api\/?$/, '');

const normalizeUploadPath = (p = '') => {
  let s = String(p || '').trim();
  if (!s) return '';
  // remove any origin accidentally saved in DB
  s = s.replace(/^https?:\/\/[^/]+/i, '');
  // windows -> web
  s = s.replace(/\\/g, '/');
  // drop leading slashes
  s = s.replace(/^\/+/, '');
  // enforce /uploads prefix
  if (!s.startsWith('uploads/')) s = `uploads/${s}`;
  return s;
};

// Build absolute URL to assets on backend
const assetUrl = (p = '') => {
  if (!p) return '';
  if (p.startsWith('http')) return p;
  const clean = String(p).replace(/^\/+/, '');
  const path = clean.startsWith('uploads/') ? clean : `uploads/${clean}`;
  return `${API_ORIGIN}/${path}`;
};

/* ===== CV helpers (hoisted) ===== */
function normalizeCv(cvLink = '') {
  const clean = String(cvLink).trim().replace(/^\/+/, '');
  return clean.split('/').pop() || '';
}
function sanitizeName(s) {
  return (s || 'CV').replace(/[^\w\- ]+/g, '').trim() || 'CV';
}
async function downloadCv(cvLink, studentName = 'CV') {
  const filename = normalizeCv(cvLink);
  if (!filename) { alert('No CV file found'); return; }
  const res = await fetch(assetUrl(filename), { credentials: 'include' });
  if (!res.ok) { alert('Failed to download CV'); return; }
  const blob = await res.blob();
  const a = document.createElement('a');
  const href = URL.createObjectURL(blob);
  a.href = href;
  const out = sanitizeName(studentName).endsWith('.pdf')
    ? sanitizeName(studentName)
    : `${sanitizeName(studentName)}.pdf`;
  a.download = out;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}
/* ===== end helpers ===== */

export default function CompanyProfile() {
  const nav = useNavigate();
  const [company, setCompany] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // applicants modal
  const [showFor, setShowFor] = useState(null);     // internship_id
  const [applicants, setApplicants] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [rowBusy, setRowBusy] = useState(null);     // application_id being acted on

  const me = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
    } catch { return null; }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: d1 }, { data: d2 }] = await Promise.all([
          api.get('/api/employer/dashboard'),
          api.get('/api/employer/internships')
        ]);
        setCompany(d1?.data || d1?.profile || null);
        
        setItems(Array.isArray(d2?.internships) ? d2.internships : []);
        setErr('');
      } catch (e) {
        setErr(e?.response?.data?.message || 'Failed to load company profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fetchApplicants = async (internshipId) => {
    setShowFor(internshipId);
    setAppsLoading(true);
    try {
      const { data } = await api.get(`/api/employer/internships/${internshipId}/applications`);
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.applications) ? data.applications : [];
      setApplicants(list);
    } catch (e) {
      console.error(e);
      setApplicants([]);
    } finally {
      setAppsLoading(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this internship? This cannot be undone.')) return;
    try {
      await api.delete(`/api/internship/${id}`);
      setItems(prev => prev.filter(x => x.id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || 'Delete failed');
    }
  };

  const approveApp = async (appId) => {
    try {
      setRowBusy(appId);
      await api.post(`/api/employer/applications/${appId}/approve`);
      setApplicants(prev =>
        prev.map(a => (a.application_id === appId ? { ...a, status: 'approved', rejection_reason: null } : a))
      );
    } catch (e) {
      alert(e?.response?.data?.message || 'Approve failed');
    } finally {
      setRowBusy(null);
    }
  };

  const rejectApp = async (appId) => {
    const reason = prompt('Reason for rejection (required):');
    if (reason === null) return;
    if (!reason.trim()) return alert('Please enter a reason.');
    try {
      setRowBusy(appId);
      await api.post(`/api/employer/applications/${appId}/reject`, { reason });
      setApplicants(prev =>
        prev.map(a =>
          a.application_id === appId ? { ...a, status: 'rejected', rejection_reason: reason } : a
        )
      );
    } catch (e) {
      alert(e?.response?.data?.message || 'Reject failed');
    } finally {
      setRowBusy(null);
    }
  };

  if (loading) return <div style={{ padding:24 }}>Loading…</div>;
  if (err) return <div style={{ padding:24, color:'#b91c1c' }}>{err}</div>;

  return (
    <div className="co-page">
      {/* Responsive CSS (HTML+CSS only, no logic changes) */}
      <style>{`
        :root{
          --bg:#F6F7F9; --card:#fff; --br:#E5E7EB; --ink:#0b1020; --muted:#64748b;
          --pri:#2563eb; --amber:#f59e0b; --ghost:#f5f7fb;
        }
        .co-page{ background:var(--bg); min-height:100svh; padding:16px; }
        .co-wrap{ max-width:1100px; margin:0 auto; display:grid; gap:16px; }

        .card{
          background:var(--card);
          border:1px solid var(--br);
          border-radius:16px;
          box-shadow:0 10px 24px rgba(0,0,0,.06);
          overflow:hidden;
        }

        /* Header — renamed to avoid collision with app .hdr */
        .co-wrap .co-hdr{
          display:grid;
          grid-template-columns: 90px 1fr auto;
          gap:16px;
          align-items:center;
          padding:16px 18px;
          border-bottom:1px solid var(--br);
        }
        .logo{ width:90px; height:90px; object-fit:cover; border-radius:12px; border:1px solid var(--br); }
        .name{ margin:0 0 4px; font-size:clamp(18px,2.4vw,22px); color:var(--ink); font-weight:800; }
        .meta{ font-size:13px; color:var(--muted); }
        .desc{ margin:8px 0 0; color:#374151; font-size:14px; }
        .hdr-actions{ display:flex; gap:10px; flex-wrap:wrap; justify-self:end; }
        .btn{
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          padding:10px 12px; border-radius:10px; font-weight:700; text-decoration:none; cursor:pointer;
          border:1px solid var(--br); background:var(--ghost); color:#111827;
        }
        .btn.primary{ background:var(--pri); color:#fff; border-color:transparent; }
        .btn.warn{ background:var(--amber); color:#fff; border-color:transparent; }

        .sec-head{ display:flex; align-items:center; justify-content:space-between; padding:10px 12px; }

        /* Table */
        .tbl-wrap{
          overflow-x:auto; -webkit-overflow-scrolling:touch;
          border:1px solid var(--br); border-radius:16px; background:#fff; margin:0 12px 12px;
        }
        .tbl{
          width:100%; min-width:680px; border-collapse:separate; border-spacing:0; background:#fff;
        }
        .tbl th,.tbl td{ padding:12px 14px; border-bottom:1px solid #eef2f7; text-align:left; font-size:14px; color:#111827; }
        .tbl th{ color:#6b7280; background:#f8fafc; font-weight:700; }
        .tbl tr:last-child td{ border-bottom:0; }

        .pill{ display:inline-block; padding:4px 8px; font-size:12px; font-weight:700; border-radius:8px; }
        .pill.approved{ background:#d1fadf; color:#067647; }
        .pill.rejected{ background:#fee4e2; color:#912018; }
        .pill.pending{  background:#fef0c7; color:#93370d; }

        .row-actions{ display:flex; gap:10px; flex-wrap:wrap; }
        .row-actions .link{ color:#2563eb; text-decoration:none; font-size:13px; }
        .row-actions .danger{ color:#b91c1c; background:none; border:0; padding:0; font-size:13px; cursor:pointer; }

        /* Modal table */
        .tbl-modal{ width:100%; min-width:800px; border-collapse:separate; border-spacing:0; background:#fff; }
        .tbl-modal th,.tbl-modal td{ padding:12px 14px; border-bottom:1px solid #eef2f7; text-align:left; font-size:14px; }
        .tbl-modal th{ background:#f8fafc; color:#6b7280; font-weight:700; }
        .tinyBtn{
          font-size:12px; padding:6px 10px; border-radius:8px; border:1px solid #c7d2fe;
          background:#e9efff; color:#1e3a8a; cursor:pointer;
        }
        .tinyBtn.danger{ background:#fff1f2; border-color:#fecdd3; color:#9f1239; }

        /* Mobile tweaks */
        @media (max-width:700px){
          .co-hdr{ grid-template-columns: 1fr !important; align-items:start; }
          .logo{ width:72px; height:72px; }
          .hdr-actions{ order:3; justify-content:flex-end; }
          .tbl{ min-width:0 !important; }
        }
        @media (max-width:560px){
          .tbl thead{ display:none; }
          .tbl, .tbl tbody, .tbl tr, .tbl td{ display:block; width:100%; }
          .tbl tr{ background:#fff; border:1px solid var(--br); border-radius:12px; padding:10px 12px; margin:10px 0; }
          .tbl td{ border:0; padding:8px 0; display:flex; justify-content:space-between; gap:12px; }
          .tbl td::before{
            content:attr(data-label); font-weight:700; color:#374151; flex:0 0 44%; max-width:48%;
          }
          .row-actions{ justify-content:flex-end; }
        }
        @media (max-width:520px){
          .tbl-modal{ min-width:0 !important; }
          .tbl-modal thead{ display:none; }
          .tbl-modal, .tbl-modal tbody, .tbl-modal tr, .tbl-modal td{ display:block; width:100%; }
          .tbl-modal tr{ background:#fff; border:1px solid var(--br); border-radius:12px; padding:10px 12px; margin:10px 0; }
          .tbl-modal td{ border:0; padding:8px 0; display:flex; justify-content:space-between; gap:12px; }
          .tbl-modal td::before{
            content:attr(data-label); font-weight:700; color:#374151; flex:0 0 44%; max-width:48%;
          }
        }
      `}</style>

      <div className="co-wrap">
        {/* Company header */}
        <div className="card">
          <div className="co-hdr">
            <img
                className="logo"
                src={company?.company_logo ? assetUrl(company.company_logo) : ''}
                alt="Company logo"
                onError={(e) => { e.currentTarget.src = userIcon; }}
              />
            <div>
              <h2 className="name">{company?.name || 'Company'}</h2>
              <div className="meta">
                {me?.email} {company?.location ? ' • ' + company.location : ''}
              </div>
              {company?.description && (
                <p className="desc">{company.description}</p>
              )}
            </div>
            <div className="hdr-actions">
              <Link to="/internships/new" className="btn primary">+ Create Internship</Link>
              <button
                className="btn btnSmall"
                onClick={() => nav('/profile/company/password')}
              >
                Change Password
              </button>
              <Link to="/profile/company/edit" className="btn warn">Edit Profile</Link>
            </div>
          </div>
        </div>

        {/* Posted Internships */}
        <div className="card">
          <div className="sec-head">
            <h3 style={{margin:0}}>Posted Internships</h3>
          </div>

          {items.length === 0 ? (
            <div style={{ padding:'12px 18px', color:'#6b7280' }}>No internships posted yet.</div>
          ) : (
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Industry</th>
                    <th>Approval</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i.id}>
                      <td data-label="Name">{i.title}</td>
                      <td data-label="Industry">{i.industry || '-'}</td>
                      <td data-label="Approval">
                        <span className={`pill ${String(i.status || 'pending').toLowerCase()}`}>
                          {(i.status || 'pending').replace(/^\w/, s => s.toUpperCase())}
                        </span>
                      </td>
                      <td data-label="Actions">
                        <div className="row-actions">
                          <Link to={`/internships/${i.id}`} className="link">View</Link>
                          <Link to={`/internships/${i.id}/edit`} className="link">Edit</Link>
                          <button onClick={() => fetchApplicants(i.id)} className="link" style={{background:'none',border:0}}>Applicants</button>
                          <button onClick={() => onDelete(i.id)} className="danger">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Applicants modal */}
        {showFor && (
          <div
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.35)', display:'grid', placeItems:'center', zIndex:50 }}
            onClick={() => setShowFor(null)}
          >
            <div
              style={{ width:'min(1000px, 92vw)', maxHeight:'80vh', overflow:'auto', background:'#fff', borderRadius:16, padding:16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                <h3 style={{ margin:0 }}>Applicants</h3>
                <button onClick={() => setShowFor(null)} style={{ border:'none', background:'none', fontSize:22, lineHeight:1, cursor:'pointer' }}>×</button>
              </div>

              {appsLoading ? (
                <div style={{ padding:12 }}>Loading…</div>
              ) : applicants.length === 0 ? (
                <div style={{ padding:12, color:'#6b7280' }}>No applications yet.</div>
              ) : (
                <div style={{ overflowX:'auto', marginTop:8 }}>
                  <table className="tbl-modal">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>CV</th>
                        <th>Reason</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map(a => {
                        const id = a.application_id || a.id;
                        const status = (a.status || 'pending').toLowerCase();
                        const fileOnly = a.cv_link ? normalizeCv(a.cv_link) : '';
                        const viewHref = fileOnly ? assetUrl(fileOnly) : '';
                        return (
                          <tr key={id}>
                            <td data-label="Student">{a.student_name || a.name || '-'}</td>
                            <td data-label="Email">{a.student_email || a.email || '-'}</td>
                            <td data-label="Status">
                              <span className={`pill ${status}`}>
                                {status.replace(/^\w/, s => s.toUpperCase())}
                              </span>
                            </td>
                            <td data-label="CV">
                              {fileOnly ? (
                                <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                                  <a href={viewHref} target="_blank" rel="noreferrer">View</a>
                                  <button
                                    onClick={() => downloadCv(a.cv_link, a.student_name || a.name || 'CV')}
                                    className="tinyBtn"
                                    disabled={rowBusy === id}
                                    style={{ opacity: rowBusy === id ? .6 : 1 }}
                                  >
                                    Download
                                  </button>
                                </div>
                              ) : '—'}
                            </td>
                            <td data-label="Reason" style={{ maxWidth:280, wordBreak:'break-word' }}>
                              {a.rejection_reason || '—'}
                            </td>
                            <td data-label="Action" style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                              <button
                                onClick={() => approveApp(id)}
                                disabled={rowBusy === id || status === 'approved'}
                                className="tinyBtn"
                                style={{ opacity:(rowBusy === id || status === 'approved') ? .6 : 1 }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectApp(id)}
                                disabled={rowBusy === id || status === 'rejected'}
                                className="tinyBtn danger"
                                style={{ opacity:(rowBusy === id || status === 'rejected') ? .6 : 1 }}
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
