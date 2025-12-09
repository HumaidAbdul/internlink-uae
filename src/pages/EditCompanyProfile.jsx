import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";

// === inline styles (no utility class names) ===
const styles = {
  page: {
    minHeight: '100dvh',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg, #eef2ff, #f8fafc)'
  },
  card: {
    width: '100%',
    maxWidth: 'min(92vw, 880px)',
    background: '#fff',
    borderRadius: 18,
    boxShadow: '0 20px 45px rgba(0,0,0,0.08)',
    padding: 'clamp(18px, 4vw, 28px)',
    border: '1px solid #e5e7eb'
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
    flexWrap: 'wrap'
  },
  title: { margin: 0, fontSize: 'clamp(18px, 2.6vw, 22px)', color: '#0f172a' },
  subtitle: { margin: 0, color: '#6b7280', fontSize: 'clamp(12px, 2.2vw, 14px)' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 'clamp(12px, 3.5vw, 18px)',
    marginTop: 18
  },
  field: { display: 'flex', flexDirection: 'column' },
  label: { marginBottom: 6, fontSize: 14, color: '#374151', fontWeight: 600 },
  input: {
    width: '100%',
    padding: '10px 1px',
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    color: '#0f172a',
    outline: 'none'
  },
  textarea: {
    width: '100%',
    padding: '10px 1px',
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    color: '#0f172a',
    outline: 'none',
    resize: 'vertical'
  },
  helper: { marginTop: 6, fontSize: 12, color: '#6b7280' },
  error: {
    margin: '8px 0 0',
    background: '#fee2e2',
    color: '#991b1b',
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #fecaca'
  },
  logoPreview: {
    width: 90,
    height: 90,
    objectFit: 'cover',
    borderRadius: 14,
    border: '1px solid #e5e7eb',
    marginBottom: 10
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
    flexWrap: 'wrap'
  },
  primaryBtn: {
    display: 'inline-block',
    padding: '12px 16px',
    background: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontWeight: 700,
    cursor: 'pointer'
  },
  secondaryBtn: {
    display: 'inline-block',
    padding: '12px 16px',
    background: '#6b7280',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontWeight: 600,
    cursor: 'pointer'
  }
};

const IconHex = ({ color = '#2563eb' }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2 20 7v10l-8 5-8-5V7l8-5Z" stroke={color} strokeWidth="1.6" />
  </svg>
);

const API_ORIGIN = (process.env.REACT_APP_API_BASE || 'http://localhost:5001').replace(/\/api\/?$/, '');
const assetUrl = (p = '') => {
  if (!p) return '';
  if (p.startsWith('http')) return p;
  const clean = String(p).replace(/^\/+/, '');
  const path = clean.startsWith('uploads/') ? clean : `uploads/${clean}`;
  return `${API_ORIGIN}/${path}`;
};

export default function EditCompanyProfile() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    location: '',
    description: '',
    company_logo_url: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/employer/dashboard');
        const p = data?.data || data?.profile || data || {};
        const payload = {
          name: p.name || p.company_name || '',
          email: p.email || '',
          location: p.location || '',
          description: p.description || '',
          company_logo_url: p.company_logo || p.logo || ''
        };
        setForm(payload);
        setPreview(payload.company_logo_url ? assetUrl(payload.company_logo_url) : '');
        setErr('');
      } catch (e) {
        setErr(e?.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onText = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const onLogo = (e) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr('');
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('email', form.email);
      fd.append('location', form.location);
      fd.append('description', form.description);
      if (logoFile) fd.append('company_logo', logoFile);
      await api.put('/api/employer/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      nav('/profile/company');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 24, color: '#64748b' }}>Loading…</div>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.brandRow}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, background: '#eef2ff', border: '1px solid #e0e7ff' }}>
            <IconHex />
          </span>
          <div>
            <h1 style={styles.title}>Edit Company</h1>
            <p style={styles.subtitle}>Update your employer profile details.</p>
          </div>
        </div>

        {err && <div style={styles.error}>{err}</div>}

        {/* Form */}
        <form onSubmit={onSubmit} encType="multipart/form-data" style={{ marginTop: 8 }}>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>Company Name <span style={{ color: '#ef4444' }}>*</span></label>
              <input name="name" value={form.name} onChange={onText} placeholder="e.g., FutureTech LLC" required style={styles.input} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Work Email <span style={{ color: '#ef4444' }}>*</span></label>
              <input name="email" type="email" value={form.email} onChange={onText} placeholder="hr@company.com" required style={styles.input} />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Location</label>
              <input name="location" value={form.location} onChange={onText} placeholder="City, Country" style={styles.input} />
            </div>

            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <label style={styles.label}>About Company</label>
              <textarea name="description" value={form.description} onChange={onText} rows={5} placeholder="Tell students about your organization and the kind of internships you offer." style={styles.textarea} />
            </div>

            {/* Logo */}
            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Company Logo (PNG/JPG)</label>
              {preview ? (
                <img src={preview} alt="Company logo preview" style={styles.logoPreview} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : null}
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 12px' }}>
                <input type="file" name="company_logo" accept="image/*" onChange={onLogo} style={{ display: 'none' }} />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 13v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6h2v6h10v-6h2Zm-7-2 3 3h-2v4h-2v-4H9l3-3ZM17 3a2 2 0 0 1 2 2v6h-2V5H7v6H5V5a2 2 0 0 1 2-2h10Z"/></svg>
                <span style={{ fontWeight: 600, color: '#334155' }}>Choose file</span>
              </label>
              <div style={styles.helper}>Optional — shown on your public profile. Max 2MB.</div>
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button type="submit" disabled={saving} style={{ ...styles.primaryBtn, opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => nav('/profile/company')} style={styles.secondaryBtn}>Back</button>
          </div>
        </form>
      </div>
    </div>
  );
}
