// src/pages/ChangePassword.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const styles = {
  page: {
    minHeight: '100dvh',
    display: 'grid',
    placeItems: 'center',
    padding: 16,
    background: 'linear-gradient(135deg, #eef2ff, #f8fafc)',
  },
  card: {
    width: '100%',
    maxWidth: 560,
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #e5e7eb',
    boxShadow: '0 20px 45px rgba(0,0,0,.08)',
    padding: 'clamp(18px, 4vw, 28px)',
  },
  h1: { margin: 0, fontSize: 'clamp(18px,2.4vw,22px)' },
  p: { margin: '6px 0 16px', color: '#6b7280' },
  form: { display: 'grid', gap: 12, marginTop: 6 },
  label: { fontSize: 14, color: '#374151' },
  inputWrap: { display: 'grid', gap: 6 },
  input: {
    width: '100%',
    padding: '10px 1px',
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    outline: 'none',
    background: '#fff',
  },
  row: { display: 'grid', gap: 12 },
  actions: { display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' },
  btn: {
    display: 'inline-block',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid transparent',
    fontWeight: 700,
    cursor: 'pointer',
  },
  primary: { background: '#2563eb', color: '#fff' },
  muted: { background: '#6b7280', color: '#fff' },
  danger: { background: '#ef4444', color: '#fff' },
  err: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '10px 12px',
    borderRadius: 10,
  },
  ok: {
    background: '#e8f7ee',
    color: '#166534',
    padding: '10px 12px',
    borderRadius: 10,
  },
  hint: { fontSize: 12, color: '#6b7280' },
  toggle: {
    fontSize: 12,
    color: '#2563eb',
    background: 'none',
    border: 0,
    padding: 0,
    cursor: 'pointer',
    justifySelf: 'start',
  },
};

function usePwdRules(newPwd, currentPwd) {
  return useMemo(() => {
    const problems = [];
    if (!newPwd || newPwd.length < 8) problems.push('At least 8 characters');
    if (!/[A-Za-z]/.test(newPwd)) problems.push('Include a letter');
    if (!/\d/.test(newPwd)) problems.push('Include a number');
    if (currentPwd && newPwd === currentPwd) problems.push('Must differ from current');
    return problems;
  }, [newPwd, currentPwd]);
}

/**
 * props:
 * - title: string
 * - submitPath: '/api/student/password' | '/api/employer/password'
 * - backTo: '/profile/student' | '/profile/company'
 */
export default function ChangePassword({ title = 'Change Password', submitPath, backTo }) {
  const nav = useNavigate();
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [show, setShow] = useState({ current: false, next: false, confirm: false });

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const problems = usePwdRules(newPwd, currentPwd);
  const disabled = saving || !currentPwd || !newPwd || !confirmPwd || problems.length > 0 || newPwd !== confirmPwd;

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr('');
    setOk('');
    try {
      await api.put(submitPath, {
        current_password: currentPwd,
        new_password: newPwd,
        confirm_password: confirmPwd,
      });
      setOk('Password updated successfully.');
      setTimeout(() => nav(backTo), 700);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.h1}>{title}</h1>
        <p style={styles.p}>Use a strong password you haven’t used here before.</p>

        {err && <div style={styles.err}>{err}</div>}
        {ok && <div style={styles.ok}>{ok}</div>}

        <form onSubmit={onSubmit} style={styles.form}>
          <div style={styles.inputWrap}>
            <label style={styles.label}>Current password</label>
            <input
              style={styles.input}
              type={show.current ? 'text' : 'password'}
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button type="button" style={styles.toggle}
              onClick={() => setShow(s => ({ ...s, current: !s.current }))}>
              {show.current ? 'Hide' : 'Show'}
            </button>
          </div>

          <div style={styles.inputWrap}>
            <label style={styles.label}>New password</label>
            <input
              style={styles.input}
              type={show.next ? 'text' : 'password'}
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button type="button" style={styles.toggle}
              onClick={() => setShow(s => ({ ...s, next: !s.next }))}>
              {show.next ? 'Hide' : 'Show'}
            </button>
            <div style={styles.hint}>
              Must include: letters + numbers, min 8 chars.
              {problems.length > 0 && (
                <div style={{ color: '#b91c1c', marginTop: 4 }}>
                  {problems.map(p => <div key={p}>• {p}</div>)}
                </div>
              )}
            </div>
          </div>

          <div style={styles.inputWrap}>
            <label style={styles.label}>Confirm new password</label>
            <input
              style={styles.input}
              type={show.confirm ? 'text' : 'password'}
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              autoComplete="new-password"
              required
            />
            <button type="button" style={styles.toggle}
              onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}>
              {show.confirm ? 'Hide' : 'Show'}
            </button>
            {confirmPwd && newPwd !== confirmPwd && (
              <div style={{ ...styles.hint, color: '#b91c1c' }}>Passwords do not match.</div>
            )}
          </div>

          <div style={styles.actions}>
            <button type="submit" style={{ ...styles.btn, ...styles.primary, opacity: disabled ? .7 : 1 }} disabled={disabled}>
              {saving ? 'Saving…' : 'Update password'}
            </button>
            <button type="button" style={{ ...styles.btn, ...styles.muted }} onClick={() => nav(backTo)}>
              Cancel
            </button>
            <button
              type="button"
              style={{ ...styles.btn, ...styles.danger, marginLeft: 'auto' }}
              onClick={() => { setCurrentPwd(''); setNewPwd(''); setConfirmPwd(''); setErr(''); setOk(''); }}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
