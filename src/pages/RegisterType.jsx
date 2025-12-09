// src/pages/RegisterType.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function RegisterType() {
  const styles = {
    page: {
      minHeight: '100dvh',                 // better on mobile than 100vh
      display: 'grid',
      placeItems: 'center',
      padding: '16px',                     // safe side-margins on phones
      background: 'linear-gradient(135deg, #eef2ff, #f8fafc)',
    },
    card: {
      width: '100%',
      maxWidth: 'min(92vw, 880px)',        // never wider than viewport
      background: '#fff',
      borderRadius: 18,
      boxShadow: '0 20px 45px rgba(0,0,0,0.08)',
      padding: 'clamp(18px, 4vw, 28px)',   // scales with screen
      border: '1px solid #e5e7eb',
    },
    brandRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 10,
      flexWrap: 'wrap',                    // prevents overflow on tiny widths
    },
    title: { margin: 0, fontSize: 'clamp(18px, 2.6vw, 22px)' },
    subtitle: { margin: 0, color: '#6b7280', fontSize: 'clamp(12px, 2.2vw, 14px)' },

    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', // stacks on phones
      gap: 'clamp(12px, 3.5vw, 18px)',
      marginTop: 18,
    },
    option: {
      background: '#f8fafc',
      borderRadius: 14,
      padding: 'clamp(14px, 3.5vw, 20px)',
      border: '1px solid #e5e7eb',
      boxShadow: '0 6px 18px rgba(0,0,0,0.04)',
    },
    optHead: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 10,
      flexWrap: 'wrap',                    // allow icon + title to wrap
    },
    optTitle: {
      margin: 0,
      fontSize: 'clamp(16px, 2.4vw, 18px)',
      wordBreak: 'break-word',             // no clipped text
    },
    p: { margin: '6px 0 12px', color: '#6b7280', fontSize: 'clamp(13px, 2.3vw, 14px)' },
    ul: { margin: '0 0 14px 18px', color: '#4b5563', fontSize: 'clamp(13px, 2.3vw, 14px)' },
    li: { marginBottom: 6 },

    btn: {
      display: 'inline-block',
      padding: '12px 14px',
      background: '#2563eb',
      color: '#fff',
      borderRadius: 10,
      textDecoration: 'none',
      fontWeight: 600,
      fontSize: 'clamp(14px, 2.4vw, 15px)',
    },
    ghostBtn: {
      display: 'inline-block',
      padding: '12px 14px',
      borderRadius: 10,
      color: '#2563eb',
      border: '1px solid #c7d2fe',
      textDecoration: 'none',
      fontWeight: 600,
      fontSize: 'clamp(14px, 2.4vw, 15px)',
    },
    footer: { marginTop: 18, textAlign: 'center' },
    small: { fontSize: 13, color: '#6b7280' },
  };

  const Icon = ({ color = '#2563eb' }) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke={color} strokeWidth="1.6"/>
    </svg>
  );
  const StudentIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3L2 8l10 5 10-5-10-5Zm0 7l-7.5-3.75M12 13v7"
            stroke="#1d4ed8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const CompanyIcon = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 21h18M6 21V7h6v14M12 7l6 2v12"
            stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <main style={styles.page}>
      <section style={styles.card} aria-label="Choose register type">
        <div style={styles.brandRow}>
          <Icon />
          <div>
            <h1 style={styles.title}>InternLink UAE</h1>
            <p style={styles.subtitle}>Select Register Type</p>
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.option}>
            <div style={styles.optHead}>
              <StudentIcon />
              <h3 style={styles.optTitle}>Register as Student</h3>
            </div>
            <p style={styles.p}>
              Create your profile, upload your CV and start applying to internships tailored to your major.
            </p>
            <ul style={styles.ul}>
              <li style={styles.li}>Personalized dashboard</li>
              <li style={styles.li}>Real-time application tracking</li>
              <li style={styles.li}>Direct messaging with employers</li>
            </ul>
            <Link to="/register/student" style={styles.btn}>Continue as Student</Link>
          </div>

          <div style={styles.option}>
            <div style={styles.optHead}>
              <CompanyIcon />
              <h3 style={styles.optTitle}>Register as Company</h3>
            </div>
            <p style={styles.p}>
              Post internship openings and manage applicants from universities across the UAE.
            </p>
            <ul style={styles.ul}>
              <li style={styles.li}>Branded company profile</li>
              <li style={styles.li}>Applicant filtering and shortlisting</li>
              <li style={styles.li}>Fast messaging & status updates</li>
            </ul>
            <Link to="/register/company" style={{ ...styles.btn, background: '#16a34a' }}>
              Continue as Company
            </Link>
          </div>
        </div>

        <div style={styles.footer}>
          <span style={styles.small}>Already have an account? </span>
          <Link to="/login" style={styles.ghostBtn}>Login</Link>
        </div>
      </section>
    </main>
  );
}
