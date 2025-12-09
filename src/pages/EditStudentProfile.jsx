// src/pages/EditStudentProfile.jsx  (frontend)
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import userIcon from './img/userImg.jpg';

const API_ORIGIN = (process.env.REACT_APP_API_BASE || 'http://localhost:5001')
  .replace(/\/api\/?$/i, '')
  .replace(/\/+$/, '');

const normalizeAsset = (p = '') => {
  if (!p) return '';
  if (/^https?:\/\//i.test(p)) return p;
  let s = String(p).trim().replace(/^https?:\/\/[^/]+/i, '').replace(/\\/g, '/').replace(/^\/+/, '');
  if (!/^uploads\//i.test(s)) s = `uploads/${s}`;
  return `${API_ORIGIN}/${s}`;
};

export default function EditStudentProfile() {
  const navigate = useNavigate();
  const assetUrl = useMemo(() => normalizeAsset, []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const [form, setForm] = useState({ name:'', email:'', university:'', major:'' });
  const [current, setCurrent] = useState({ profile_image:'', cv_link:'' });
  const [files, setFiles] = useState({ profile_image: null, cv: null });
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get('/api/student/dashboard');
        const s = data?.profile || data || {};
        if (!alive) return;
        setForm({ name:s.name||'', email:s.email||'', university:s.university||'', major:s.major||'' });
        setCurrent({ profile_image:s.profile_image||'', cv_link:s.cv_link||'' });
      } catch (e) {
        setError(e?.response?.data?.message || 'Error fetching profile');
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive=false; if (previewImg) URL.revokeObjectURL(previewImg); };
  }, [previewImg]);

  const onText = (e)=> setForm(p=>({ ...p, [e.target.name]: e.target.value }));
  const onFile = (e)=> {
    const file = e.target.files?.[0] || null;
    setFiles(p=>({ ...p, [e.target.name]: file }));
    if (e.target.name==='profile_image') {
      if (previewImg) URL.revokeObjectURL(previewImg);
      setPreviewImg(file ? URL.createObjectURL(file) : null);
    }
  };

  const onSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  setError('');

  try {
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('email', form.email);
    fd.append('university', form.university);
    fd.append('major', form.major);
    if (files.profile_image) fd.append('profile_image', files.profile_image); // image
    if (files.cv)            fd.append('cv', files.cv);                        // pdf
    

    // ✅ Let Axios/browser set the boundary automatically
    await api.put('/api/student/dashboard', fd);

    navigate('/profile/student');
  } catch (err) {
    setError(err?.response?.data?.message || err.message || 'Error updating profile');
  } finally {
    setSaving(false);
  }
};

  if (loading) return <div style={{padding:24}}>Loading…</div>;

  return (
    <main className="ep">
      <style>{`
        :root{ --bg:#F6F7F9; --card:#fff; --br:#E5E7EB; --ink:#111827; --muted:#6B7280; }
        .ep{ background:var(--bg); min-height:100svh; padding:16px; }
        .ep-wrap{ max-width:900px; margin:24px auto; padding:0 12px; }
        .ep-card{ background:var(--card); border:1px solid var(--br); border-radius:16px; padding:24px; box-shadow:0 6px 18px rgba(0,0,0,.06); }
        .ep-title{ margin:0 0 14px; font-size:clamp(18px,2.2vw,22px); font-weight:800; color:var(--ink); }
        .ep-grid{ display:grid; gap:16px; grid-template-columns:1fr; }
        @media (min-width:860px){ .ep-grid{ grid-template-columns: 320px 1fr; align-items:start; } }
        .ep-left{ display:grid; gap:14px; }
        .ep-avatar{ display:grid; place-items:center; padding:16px; background:#fafbff; border:1px dashed var(--br); border-radius:12px; }
        .ep-avatar img{ width:120px; height:120px; object-fit:cover; border-radius:50%; border:3px solid var(--br); }
        .ep-field{ display:grid; gap:6px; }
        .ep-label{ font-size:14px; color:#374151; }
        .ep-input{ width:100%; padding:10px 12px; border:1px solid var(--br); border-radius:10px; outline:none; background:#fff; }
        .ep-help{ font-size:12px; color:var(--muted); margin-top:2px; }
        .ep-error{ background:#fee2e2; color:#991b1b; padding:10px 12px; border-radius:10px; margin-bottom:12px; }
        .ep-actions{ display:flex; gap:12px; margin-top:6px; }
        .btn{ border:0; border-radius:10px; padding:10px 14px; cursor:pointer; font-weight:700; }
        .btn.primary{ background:#2563eb; color:#fff; }
        .btn.muted{ background:#6b7280; color:#fff; }
        .ep-current-file{ display:inline-block; margin-top:8px; font-size:13px; }
      `}</style>

      <div className="ep-wrap">
        <div className="ep-card">
          <h2 className="ep-title">Edit Your Profile</h2>
          {error && <div className="ep-error">{error}</div>}

          <form onSubmit={onSubmit} encType="multipart/form-data" className="ep-grid">
            <section className="ep-left">
              <div className="ep-avatar">
                <img
                  src={previewImg || (current.profile_image ? assetUrl(current.profile_image) : userIcon)}
                  alt="Profile preview"
                  onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src = userIcon; }}
                />
              </div>

              <div className="ep-field">
                <label className="ep-label">Profile Image</label>
                <input className="ep-input" type="file" name="profile_image" accept="image/*" onChange={onFile} />
                <span className="ep-help">PNG/JPG, optional.</span>
              </div>

              <div className="ep-field">
                <label className="ep-label">CV (PDF)</label>
                <input className="ep-input" type="file" name="cv" accept="application/pdf" onChange={onFile} />
                {current.cv_link && <a className="ep-current-file" href={assetUrl(current.cv_link)} target="_blank" rel="noreferrer">View current CV</a>}
              </div>
            </section>

            <section>
              <div className="ep-field">
                <label className="ep-label">Name</label>
                <input className="ep-input" name="name" value={form.name} onChange={onText} required />
              </div>
              <div className="ep-field">
                <label className="ep-label">Email</label>
                <input className="ep-input" type="email" name="email" value={form.email} onChange={onText} required />
              </div>
              <div className="ep-field">
                <label className="ep-label">University</label>
                <input className="ep-input" name="university" value={form.university} onChange={onText} />
              </div>
              <div className="ep-field">
                <label className="ep-label">Major</label>
                <input className="ep-input" name="major" value={form.major} onChange={onText} />
              </div>

              <div className="ep-actions">
                <button type="submit" className="btn primary" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
                <button type="button" className="btn muted" onClick={() => navigate('/profile/student')}>Cancel</button>
              </div>
            </section>
          </form>
        </div>
      </div>
    </main>
  );
}
