// src/pages/RegisterCompany.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import api from '../lib/api';

export default function RegisterCompany() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({
    company_name: '',
    email: '',
    password: '',
    confirm_password: '',
    location: '',
    about: '',
    agree: false,
    logo: null,
  });

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') setForm((f) => ({ ...f, [name]: checked }));
    else if (type === 'file') {
      const file = files?.[0];
      if (file && !/^image\//.test(file.type)) {
        toast.error('Please choose an image file (PNG/JPG).');
        return;
      }
      if (file && file.size > 2 * 1024 * 1024) {
        toast.error('Max logo size is 2MB.');
        return;
      }
      setForm((f) => ({ ...f, logo: file || null }));
    } else setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (form.company_name.trim().length < 2) return 'Company name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid work email.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirm_password) return 'Passwords do not match.';
    if (!form.agree) return 'Please accept the Terms and Privacy Policy.';
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    setLoading(true);
    try {
      const fd = new FormData();
      // required by API
      fd.append('company_name', form.company_name);
      fd.append('full_name', form.company_name); // harmless fallback if backend still expects full_name
      fd.append('email', form.email);
      fd.append('password', form.password);
      fd.append('location', form.location);
      fd.append('description', form.about || '');
      if (form.logo) fd.append('logo', form.logo);

      await api.post('/api/employer/register', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Company account created! Redirecting to login…');
      setTimeout(() => nav('/'), 900);
    } catch (err2) {
      const msg =
        err2?.response?.data?.message ||
        err2?.response?.data?.error ||
        'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ---- Styles (responsive) ----
  const styles = {
    page: {
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: 'linear-gradient(135deg, #eef2ff, #f8fafc)',
      padding: '24px 14px',
    },
    card: {
      width: '100%',
      maxWidth: 980,
      background: '#fff',
      borderRadius: 18,
      border: '1px solid #e5e7eb',
      boxShadow: '0 22px 45px rgba(0,0,0,0.08)',
      padding: 28,
    },
    headerRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' },
    h1: { margin: 0, fontSize: 22 },
    sub: { margin: 0, color: '#6b7280', fontSize: 14 },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: 14,
    },
    input: {
      width: '100%',
      padding: '10px 1px',
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      outline: 'none',
      fontSize: 14,
      background: '#f8fafc',
    },
    label: { fontWeight: 600, fontSize: 13, marginBottom: 6, display: 'block' },
    textArea: {
      width: '100%',
      minHeight: 120,
      padding: '10px 1px',
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      outline: 'none',
      fontSize: 14,
      background: '#f8fafc',
      gridColumn: '1 / -1',
    },
    fileWrap: {
      gridColumn: '1 / -1',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 7,
      alignItems: 'center',
    },
    actions: {
      marginTop: 14,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap',
    },
    primary: {
      padding: '12px 18px',
      borderRadius: 10,
      background: '#16a34a',
      color: '#fff',
      border: 'none',
      fontWeight: 700,
      cursor: 'pointer',
    },
    ghost: {
      padding: '12px 18px',
      borderRadius: 10,
      border: '1px solid #c7d2fe',
      background: '#fff',
      color: '#2563eb',
      fontWeight: 700,
      textDecoration: 'none',
    },
    linkBtn: {
      padding: 0,
      border: 'none',
      background: 'transparent',
      color: '#2563eb',
      textDecoration: 'underline',
      cursor: 'pointer',
      fontSize: 14,
    },
  };

  return (
    <div style={styles.page}>
      <ToastContainer position="top-right" />
      <form style={styles.card} onSubmit={submit}>
        <div style={styles.headerRow}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="#2563eb" strokeWidth="1.6" />
          </svg>
          <div>
            <h1 style={styles.h1}>Register Company</h1>
            <p style={styles.sub}>Create your employer account and start posting internships.</p>
          </div>
        </div>

        <div style={styles.grid}>
          <div>
            <label style={styles.label}>Company Name *</label>
            <input
              style={styles.input}
              name="company_name"
              placeholder="e.g., FutureTech LLC"
              value={form.company_name}
              onChange={onChange}
              autoComplete="organization"
              required
            />
          </div>

          <div>
            <label style={styles.label}>Work Email *</label>
            <input
              style={styles.input}
              name="email"
              type="email"
              placeholder="hr@company.com"
              value={form.email}
              onChange={onChange}
              autoComplete="email"
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <label style={styles.label}>Password *</label>
            <input
              style={styles.input}
              name="password"
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••"
              value={form.password}
              onChange={onChange}
              autoComplete="new-password"
              required
            />
            <span style={{ position: 'absolute', right: 10, top: 36, cursor: 'pointer', fontSize: 12, color: '#6b7280' }}
                  onClick={() => setShowPwd((s) => !s)}>
              {showPwd ? 'Hide' : 'Show'}
            </span>
          </div>

          <div>
            <label style={styles.label}>Confirm Password *</label>
            <input
              style={styles.input}
              name="confirm_password"
              type="password"
              placeholder="Repeat password"
              value={form.confirm_password}
              onChange={onChange}
              autoComplete="new-password"
              required
            />
          </div>

          <div>
            <label style={styles.label}>Location</label>
            <input
              style={styles.input}
              name="location"
              placeholder="City, Country"
              value={form.location}
              onChange={onChange}
              autoComplete="address-level2"
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={styles.label}>About Company</label>
            <textarea
              style={styles.textArea}
              name="about"
              placeholder="Tell students about your organization and the kind of internships you offer."
              value={form.about}
              onChange={onChange}
            />
          </div>

          <div style={styles.fileWrap}>
            <div>
              <label style={styles.label}>Company Logo (PNG/JPG)</label>
              <input type="file" accept="image/*" name="logo" onChange={onChange} />
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                {form.logo ? `Selected: ${form.logo.name}` : 'Optional — shown on your public profile. Max 2MB.'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
            <input type="checkbox" name="agree" checked={form.agree} onChange={onChange} required />
            I agree to the <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.
          </label>
        </div>

        <div style={styles.actions}>
          <button style={styles.primary} type="submit" disabled={loading || !form.agree}>
            {loading ? 'Creating…' : 'Create Company Account'}
          </button>
          <Link to="/register" style={styles.ghost}>Back</Link>
          <div style={{ marginLeft: 'auto', fontSize: 14 }}>
            Already registered? <Link to="/">Login</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
