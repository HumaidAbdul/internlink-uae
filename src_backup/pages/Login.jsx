// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../lib/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});

  const validate = () => {
    const next = {};
    if (!email) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email';
    if (!password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      const token = data.token || data.access_token || data.jwt;
      const user  = data.user;
      if (!token || !user) throw new Error('Invalid login response');

      const sixHours = 6 * 60 * 60 * 1000; 
      sessionStorage.setItem('session_expiry', String(Date.now() + sixHours));
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      toast.success('Welcome '+ user.name +' back!');

      const role = user.role;
      if (role === 'student') navigate('/profile/student');
      else if (role === 'employer') navigate('/profile/company');
      // else if (role === 'admin') navigate('/admin');
      else navigate('/internships');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ---------- responsive styles ----------
  const styles = {
    page: {
      minHeight: '100dvh',                // better on mobile than 100vh
      display: 'grid',
      placeItems: 'center',
      padding: '16px',                    // keeps air on small screens
      background: 'linear-gradient(135deg, #eef2ff, #f8fafc)',
    },
    card: {
      width: '100%',
      maxWidth: 'min(92vw, 440px)',       // shrink to phone width, cap at 440px
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 18px 40px rgba(0,0,0,0.08)',
      padding: 'clamp(18px, 4vw, 28px)',  // scales padding with viewport
      border: '1px solid #e5e7eb',
    },
    brand: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
    title: { margin: 0, fontSize: 'clamp(18px, 2.6vw, 22px)' },
    subtitle: { margin: 0, color: '#6b7280', fontSize: 'clamp(12px, 2.2vw, 14px)' },

    form: { display: 'grid', gap: 12 },   // consistent spacing
    label: { fontSize: 'clamp(13px, 2.3vw, 14px)', color: '#374151' },

    inputWrap: { position: 'relative' },
    input: {
      width: '100%',
      padding: '12px 1px',               // bigger touch target
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      outline: 'none',
      fontSize: 16,                        // prevents iOS zoom on focus
      lineHeight: 1.3,
    },
    eyeBtn: {
      position: 'absolute', right: 10, top: '50%',
      transform: 'translateY(-50%)',
      background: 'transparent', border: 0, cursor: 'pointer', color: '#6b7280',
      fontSize: 13
    },
    err: { color: '#b91c1c', fontSize: 12, marginTop: 6 },

    btn: {
      width: '100%',
      padding: '12px 14px',
      background: '#2563eb',
      color: '#fff',
      border: 0, borderRadius: 10, cursor: 'pointer', fontWeight: 600,
      fontSize: 'clamp(14px, 2.4vw, 15px)'
    },

    footer: { marginTop: 12, textAlign: 'center' },
    small: { fontSize: 13, color: '#6b7280' },
    link: { color: '#2563eb', fontSize: 13, textDecoration: 'none' },
  };
  // ---------------------------------------

  return (
    <main style={styles.page}>
      <section style={styles.card} aria-label="Login form">
        <header style={styles.brand}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="#2563eb" strokeWidth="1.6"/>
          </svg>
          <div>
            <h1 style={styles.title}>InternLink UAE</h1>
            <p style={styles.subtitle}>Sign in to your account</p>
          </div>
        </header>

        <form onSubmit={onSubmit} noValidate style={styles.form}>
          <div>
            <label htmlFor="email" style={styles.label}>Email</label>
            <div style={styles.inputWrap}>
              <input
                id="email"
                type="email"
                inputMode="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                autoComplete="email"
                aria-invalid={!!errors.email}
              />
            </div>
            {errors.email && <div style={styles.err}>{errors.email}</div>}
          </div>

          <div>
            <label htmlFor="password" style={styles.label}>Password</label>
            <div style={styles.inputWrap}>
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                autoComplete="current-password"
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                style={styles.eyeBtn}
                aria-pressed={showPwd}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <div style={styles.err}>{errors.password}</div>}
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.small}>Don’t have an account? </span>
          <Link to="/register" style={styles.link}>Register</Link>
        </div>
      </section>
    </main>
  );
}
