import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import pinIcon from './img/pin.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [busyApply, setBusyApply] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Change to /api/internships/${id} if your backend uses plural
        const { data } = await api.get(`/api/internship/${id}`);
        setInternship(data.internship || data);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load internship');
      }
    })();
  }, [id]);

  const handleApply = async () => {
    try {
      setBusyApply(true);
      await api.post('/api/student/apply', { internship_id: Number(id) });
      toast.success('Applied successfully');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error applying');
    } finally {
      setBusyApply(false);
    }
  };

  if (!internship) return <p style={{ padding: 16 }}>Loading...</p>;

  const user = JSON.parse(sessionStorage.getItem('user') || 'null');
  const employerUserId = internship?.employer_user_id;

  const badgeStyle = (t = '') => {
    const k = String(t).toLowerCase();
    if (k === 'full-time') return { background: '#D1FADF', color: '#067647' };
    if (k === 'part-time') return { background: '#FEF0C7', color: '#93370D' };
    return { background: '#E0E7FF', color: '#3730A3' };
  };

  return (
    <main className="idp">
      <style>{`
        :root{ --bg:#F6F7F9; --card:#fff; --br:#E5E7EB; --ink:#0B1020; --muted:#6B7280; --pri:#2563EB; }
        .idp{ background:var(--bg); min-height:100svh; padding:16px; }
        .idp-wrap{ max-width:1100px; margin:24px auto; }
        .idp-top{ display:flex; align-items:center; gap:10px; margin-bottom:12px; color:var(--muted); font-size:14px; }
        .idp-top img{ width:16px; height:16px; }
        .idp-title{ margin:.2rem 0 1rem; font-size:clamp(20px,3.2vw,28px); line-height:1.2; color:var(--ink); font-weight:800; }
        .idp-grid{ display:grid; gap:18px; grid-template-columns:1fr; align-items:start; }
        @media (min-width:920px){ .idp-grid{ grid-template-columns: 1.3fr 0.7fr; } }
        .card{ background:var(--card); border:1px solid var(--br); border-radius:14px; box-shadow:0 8px 22px rgba(0,0,0,.05); }
        .idp-main{ padding:18px; }
        .idp-side{ padding:18px; }
        @media (min-width:920px){ .idp-side{ position:sticky; top:76px; } }
        .pill{ padding:4px 10px; border-radius:999px; font-weight:700; font-size:12px; }
        .section{ margin-top:14px; }
        .section h3{ margin:0 0 6px; font-size:clamp(16px,2vw,18px); }
        .section p{ margin:0; color:#374151; line-height:1.6; }
        .list{ padding-left:18px; margin:6px 0; }
        .list li{ margin:4px 0; color:#374151; }
        .dl{ display:grid; grid-template-columns: 1fr 1fr; gap:8px 12px; font-size:14px; }
        .dl dt{ color:#111827; font-weight:700; }
        .dl dd{ margin:0; color:#374151; }
        @media (min-width:520px){ .dl{ grid-template-columns: auto 1fr; } }
        .apply{ margin-top:14px; width:100%; background:#16a34a; color:#fff; border:0; border-radius:10px; padding:12px 14px; font-weight:800; font-size:16px; cursor:pointer; }
        .apply:disabled{ opacity:.6; cursor:not-allowed; }
        .message{ margin-top:12px; width:100%; background:#111827; color:#fff; border:0; border-radius:10px; padding:12px 14px; font-weight:800; font-size:16px; cursor:pointer; }
        .muted{ color:var(--muted); font-size:13px; }
        @media (min-width:920px){ .idp-side{ border-left:1px solid var(--br); } }
      `}</style>

      <div className="idp-wrap">
        <div className="idp-grid">
          {/* LEFT */}
          <section className="card idp-main">
            <div className="idp-top">
              <img src={pinIcon} alt="" />
              <span>{internship.location}</span>
              <span className="pill" style={badgeStyle(internship.job_type)}>{internship.job_type}</span>
            </div>

            <h2 className="idp-title">{internship.title}</h2>

            {internship.employer_name && (
              <div className="muted" style={{ marginBottom: 8 }}>
                Company: <strong>{internship.employer_name}</strong>
              </div>
            )}

            <div className="section">
              <h3>Description</h3>
              <p>{internship.description}</p>
            </div>

            <div className="section">
              <h3>Selection Criteria</h3>
              <p><strong>Requirements:</strong></p>
              <ul className="list">
                {(internship.requirements || '')
                  .split(/\r?\n|\\n/g)
                  .filter(Boolean)
                  .map((line, i) => <li key={i}>{line.replace(/^•\s*/, '')}</li>)}
              </ul>
            </div>

            <div className="section">
              <h3>About The Company</h3>
              <p>{internship.description}</p>
            </div>
          </section>

          {/* RIGHT */}
          <aside className="card idp-side">
            <h3 style={{marginTop:0}}>Details</h3>
            <dl className="dl">
              <dt>Industry</dt><dd>{internship.industry || '—'}</dd>
              <dt>Duration</dt><dd>{internship.duration || '—'}</dd>
              <dt>Work</dt><dd>{internship.work_mode || '—'}</dd>
              <dt>Salary</dt><dd>{internship.payment_type === 'Paid' ? 'Paid' : 'None'}</dd>
              <dt>Status</dt><dd>{internship.status || '—'}</dd>
            </dl>

            {!user && (
              <p className="muted" style={{marginTop:12}}>
                🔒 Please log in to apply or message.
              </p>
            )}

            {user && user.role === 'student' && (
              <>
                <button className="apply" onClick={handleApply} disabled={busyApply}>
                  {busyApply ? 'Applying…' : '🎯 Apply Now'}
                </button>

                {employerUserId ? (
                  <button
                    className="message"
                    onClick={() =>
                      navigate('/messages', { state: { startWithUserId: employerUserId } })
                    }
                  >
                    Message Employer
                  </button>
                ) : (
                  <p className="muted" style={{marginTop:12}}>
                    Messaging not available for this listing.
                  </p>
                )}
              </>
            )}

            {user && user.role && user.role !== 'student' && (
              <p className="muted" style={{marginTop:12}}>
                ❌ Only students can apply or message the employer from here.
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
