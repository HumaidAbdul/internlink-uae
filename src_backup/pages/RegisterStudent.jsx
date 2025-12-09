// src/pages/RegisterStudent.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../lib/api';

const UNIVERSITIES = ['HCT','Zayed University','UAEU','Khalifa University','Abu Dhabi University','Other'];
const REGISTER_URL = '/api/student/register';

export default function RegisterStudent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'', university: UNIVERSITIES[0], major:'' });
  const [cvFile, setCvFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const onText = (e) => setForm(p=>({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (!form.university) next.university = 'University is required';
    if (!form.major.trim()) next.major = 'Major is required';
    if (cvFile) {
      if (cvFile.type !== 'application/pdf') next.cv = 'CV must be a PDF';
      if (cvFile.size > 5 * 1024 * 1024) next.cv = 'CV must be ≤ 5 MB';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

const onSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);
  try {
    const fd = new FormData();
    fd.append('full_name', form.name.trim());
    fd.append('email', form.email.trim());
    fd.append('password', form.password);
    fd.append('university', form.university);
    fd.append('major', form.major.trim());
    if (cvFile)    fd.append('cv', cvFile);
    if (photoFile) fd.append('profile_image', photoFile);

    const { data } = await api.post(REGISTER_URL, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    toast.success(data?.message || 'Account created.');
    navigate('/', { replace: true });
  } catch (err) {
    console.error('Register error:', err?.response?.data || err.message);
    toast.error(err?.response?.data?.message || 'Registration failed');
  } finally {
    setLoading(false);
  }
};


  const css = `
    :root{
      --bg1:#eef2ff; --bg2:#f8fafc; --ink:#0b1020; --muted:#6b7280; --br:#e5e7eb;
      --pri:#2563eb; --ok:#16a34a; --err:#b91c1c; --ring: 0 0 0 3px rgba(37,99,235,.2);
    }
    *{ box-sizing:border-box }
    .page{ min-height:100svh; display:grid; place-items:center; padding:16px;
      background:linear-gradient(135deg,var(--bg1),var(--bg2)); }
    .card{
      width:min(92vw, 720px);
      background:#fff; color:var(--ink);
      border:1px solid var(--br); border-radius:18px; overflow:hidden;
      box-shadow:0 16px 40px rgba(0,0,0,.08);
    }
    .hero{
      padding:18px 20px;
      background:linear-gradient(180deg, #f3f6ff, transparent);
      border-bottom:1px solid var(--br);
      display:flex; gap:12px; align-items:center; flex-wrap:wrap;
    }
    .hero h1{ margin:0; font-size:clamp(18px,2.6vw,22px) }
    .hero p { margin:0; color:var(--muted); font-size:clamp(12px,2.2vw,14px) }

    .body{ padding:clamp(18px,4vw,24px) }
    .grid{ display:grid; gap:12px; grid-template-columns:1fr }
    .full{ grid-column:1 / -1 }

    @media (min-width:640px){
      .grid{ grid-template-columns:1fr 1fr }
    }

    label{ display:block; margin-bottom:6px; color:#374151; font-size:clamp(13px,2.3vw,14px) }

    .input, .select{
      width:100%; padding:12px 14px; border:1px solid var(--br); border-radius:12px; outline:none;
      font-size:16px; background:#fff; transition:border-color .15s, box-shadow .15s;
    }
    .input:focus, .select:focus{ border-color:var(--pri); box-shadow:var(--ring) }
    .invalid{ border-color:var(--err) !important }
    .err{ color:var(--err); font-size:12px; margin-top:6px }

    .inputWrap{ position:relative }
    .eye{ position:absolute; right:10px; top:50%; transform:translateY(-50%);
      background:transparent; border:0; color:var(--muted); cursor:pointer; font-size:13px }

    /* custom file input */
    .fileRow{ display:flex; gap:10px; align-items:center; flex-wrap:wrap }
    .fileHidden{ display:none }
    .fileBtn{
      display:inline-flex; align-items:center; gap:8px; padding:10px 12px; border-radius:10px;
      background:#f3f6ff; color:#1f2a54; border:1px solid #dfe5ff; cursor:pointer; font-weight:600;
    }
    .fileName{ color:#374151; font-size:14px; min-height:20px }
    .fileClear{ background:transparent; border:0; color:#ef4444; font-size:13px; cursor:pointer }

    .hint{ font-size:12px; color:var(--muted); margin-top:6px }

    .actions{ margin-top:10px }
    .btn{
      width:100%; padding:12px 16px; border:0; border-radius:12px; font-weight:700;
      background:var(--pri); color:#fff; font-size:clamp(14px,2.4vw,15px); cursor:pointer;
    }
    .btn[disabled]{ opacity:.7; cursor:not-allowed }
    .foot{ margin-top:10px; text-align:center; color:var(--muted); font-size:13px }
    .link{ color:var(--pri); text-decoration:none }
  `;

  return (
    <main className="page">
      <style>{css}</style>

      <section className="card" aria-label="Create student account">
        <div className="hero">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="#2563eb" strokeWidth="1.6"/>
          </svg>
          <div>
            <h1>Create a Student Account</h1>
            <p>Your account will be reviewed by an admin before you can sign in.</p>
          </div>
        </div>

        <div className="body">
          <form className="grid" noValidate onSubmit={onSubmit}>
           
            <div>
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" className={`input${errors.name ? ' invalid':''}`}
                     value={form.name} onChange={onText} placeholder="Ali Ahmed" />
              {errors.name && <div className="err">{errors.name}</div>}
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className={`input${errors.email ? ' invalid':''}`}
                     value={form.email} onChange={onText} placeholder="you@student.com" autoComplete="email" />
              {errors.email && <div className="err">{errors.email}</div>}
            </div>

            {/* Password */}
<div className="full">
  <label htmlFor="password">Password</label>
  <div className="inputWrap">
    <input
      id="password"
      name="password"
      type={showPwd ? 'text' : 'password'}
      className={`input${errors.password ? ' invalid' : ''}`}
      value={form.password}
      onChange={onText}
      placeholder="••••••••"
      autoComplete="new-password"
    />
    <button type="button" className="eye" onClick={() => setShowPwd(v => !v)}>
      {showPwd ? 'Hide' : 'Show'}
    </button>
  </div>
  {errors.password && <div className="err">{errors.password}</div>}
</div>

{/* Confirm password */}
<div>
  <label htmlFor="confirm">Confirm password</label>
  <div className="inputWrap">
    <input
      id="confirm"
      name="confirm"
      type={showConfirm ? 'text' : 'password'}
      className={`input${form.confirm && form.confirm !== form.password ? ' invalid' : ''}`}
      value={form.confirm}
      onChange={onText}
      placeholder="••••••••"
      autoComplete="new-password"
    />
    <button type="button" className="eye" onClick={() => setShowConfirm(v => !v)}>
      {showConfirm ? 'Hide' : 'Show'}
    </button>
  </div>
  {form.confirm && form.confirm !== form.password && (
    <div className="err">Passwords do not match</div>
  )}
</div>


            <div>
              <label htmlFor="university">University</label>
              <select id="university" name="university" className={`select${errors.university?' invalid':''}`}
                      value={form.university} onChange={onText}>
                {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              {errors.university && <div className="err">{errors.university}</div>}
            </div>

            <div>
              <label htmlFor="major">Major</label>
              <input id="major" name="major" className={`input${errors.major?' invalid':''}`}
                     value={form.major} onChange={onText} placeholder="Computer Science" />
              {errors.major && <div className="err">{errors.major}</div>}
            </div>

            <div className="full">
              <label>CV (PDF, optional)</label>
              <div className="fileRow">
                <input id="cv" type="file" accept="application/pdf" className="fileHidden"
                       onChange={(e)=>setCvFile(e.target.files?.[0]||null)} />
                <label htmlFor="cv" className="fileBtn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Upload PDF
                </label>
                <div className="fileName">{cvFile ? cvFile.name : 'No file selected'}</div>
                {cvFile && <button type="button" className="fileClear" onClick={()=>setCvFile(null)}>Remove</button>}
              </div>
              <div className="hint">Max 5 MB. You can also upload it later from your profile.</div>
              {errors.cv && <div className="err">{errors.cv}</div>}
            </div>
             <div className="full">
                  <label>Profile Photo (optional)</label>
                  <div className="fileRow">
                    <input id="photo" type="file" accept="image/*" className="fileHidden"
                          onChange={(e)=>setPhotoFile(e.target.files?.[0]||null)} />
                    <label htmlFor="photo" className="fileBtn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Upload Image
                    </label>
                    <div className="fileName">{photoFile ? photoFile.name : 'No file selected'}</div>
                    {photoFile && <button type="button" className="fileClear" onClick={()=>setPhotoFile(null)}>Remove</button>}
                  </div>
                  <div className="hint">Max 5MB. PNG/JPG</div>
                </div>
            <div className="full actions">
              <button className="btn" type="submit" disabled={loading}>
                {loading ? 'Creating account…' : 'Register'}
              </button>
              <div className="foot">
                Already have an account? <Link className="link" to="/">Login</Link>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
