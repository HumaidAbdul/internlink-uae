// src/pages/CreateInternship.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const INDUSTRIES   = ['Software','Business','Finance','Marketing','Design','Education','Healthcare'];
const WORK_MODES   = ['Onsite','Remote','Hybrid'];
const PAYMENT_TYPES= ['Paid','Unpaid','Stipend'];
const JOB_TYPES    = ['Full-time','Part-time','Internship','Contract'];
const STATUSES     = ['pending','approved','rejected'];

const linesFromText = (t) =>
  String(t || '')
    .split(/\r?\n/)
    .map(s => s.replace(/^[•\-\.\s]+/, '').trim())
    .filter(Boolean);

const textFromLines = (arr) =>
  (arr || [])
    .map(s => String(s).replace(/^[•\-\.\s]+/, '').trim())
    .filter(Boolean)
    .join('\n');

export default function CreateInternship() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    duration: '',
    // IMPORTANT: start blank so the placeholder shows and is required
    industry: '',
    work_mode: '',
    payment_type: '',
    job_type: '',
    start_date: '',
    salary: '',
    positions_available: 1,
    status: 'pending',
  });

  const [reqs, setReqs] = useState(['']);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const onText   = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const onNumber = (e) => setForm(p => ({ ...p, [e.target.name]: Math.max(0, parseInt(e.target.value || '0', 10)) }));

  const addReq    = () => setReqs(prev => [...prev, '']);
  const removeReq = (idx) => setReqs(prev => (prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)));
  const editReq   = (idx, v) => setReqs(prev => prev.map((r, i) => (i === idx ? v : r)));

  const onSubmit = async (e) => {
    e.preventDefault(); // browser blocks this automatically if any required select is still invalid ("")
    setSaving(true); setErr('');
    try {
      const requirements = textFromLines(reqs);
      await api.post('/api/internship/create', {
        ...form,
        requirements,
        positions_available: Number(form.positions_available) || 0,
        salary: form.salary?.trim() || null,
      });
      nav('/profile/company');
    } catch (e2) {
      setErr(e2?.response?.data?.message || 'Failed to create internship');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={wrap}>
      {/* Placeholder styling */}
      <style>{`
        select:required:invalid { color:#9ca3af; }  /* grey while placeholder is shown */
        option[value=""] { color:#9ca3af; }        /* placeholder option color */
      `}</style>

      <h2 style={{ marginTop: 0 }}>Create Internship</h2>
      {err && <div style={error}>{err}</div>}

      <form onSubmit={onSubmit} style={{ display:'grid', gap:12 }}>
        <input name="title" value={form.title} onChange={onText} placeholder="Title" required style={input}/>
        <textarea name="description" value={form.description} onChange={onText} rows={4} placeholder="Description" required style={input}/>
        <input name="location" value={form.location} onChange={onText} placeholder="Location" required style={input}/>
        <input name="duration" value={form.duration} onChange={onText} placeholder="Duration (e.g., 1 month)" required style={input}/>

        {/* Requirements list editor */}
        <div>
          <label style={label}>Requirements</label>
          {reqs.map((val, idx) => (
            <div key={idx} style={reqRow}>
              <span style={dot}>•</span>
              <input
                value={val}
                onChange={(e) => editReq(idx, e.target.value)}
                placeholder={`Requirement ${idx + 1}`}
                style={input}
              />
              <button
                type="button"
                onClick={() => removeReq(idx)}
                disabled={reqs.length === 1}
                style={btnGhost}
                title="Remove row"
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addReq} style={btnAdd}>+ Add requirement</button>
        </div>

        <div style={row}>
          <select name="industry" value={form.industry} onChange={onText} required style={input}>
            <option value="" disabled hidden>Choose industry</option>
            {INDUSTRIES.map(x => <option key={x} value={x}>{x}</option>)}
          </select>

          <select name="work_mode" value={form.work_mode} onChange={onText} required style={input}>
            <option value="" disabled hidden>Choose work mode</option>
            {WORK_MODES.map(x => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>

        <div style={row}>
          <select name="payment_type" value={form.payment_type} onChange={onText} required style={input}>
            <option value="" disabled hidden>Payment</option>
            {PAYMENT_TYPES.map(x => <option key={x} value={x}>{x}</option>)}
          </select>

          <select name="job_type" value={form.job_type} onChange={onText} required style={input}>
            <option value="" disabled hidden>Job type</option>
            {JOB_TYPES.map(x => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>

        <div style={row}>
          <input type="date" name="start_date" value={form.start_date} onChange={onText} required style={input}/>
          <input name="salary" value={form.salary} onChange={onText} placeholder='Salary (e.g., "None" or "AED 3000")' style={input}/>
        </div>

         <div style={row}>
        </div>

        <div style={row}>
          <input
            type="number"
            min={0}
            name="positions_available"
            value={form.positions_available}
            onChange={onNumber}
            placeholder="Positions available"
            style={input}
          />
        </div>

        <div style={{ display:'flex', gap:12 }}>
          <button type="submit" disabled={saving} style={{ ...btn, background:'#2563eb' }}>
            {saving ? 'Saving…' : 'Create'}
          </button>
          <button type="button" onClick={() => nav(-1)} style={{ ...btn, background:'#6b7280' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* ===== tiny styles ===== */
const wrap  = { maxWidth:780, margin:'40px auto', background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, padding:24 };
const row   = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 };
const input = { width:'100%', padding:'10px 1px', border:'1px solid #e5e7eb', borderRadius:8, appearance:'none' };
const btn   = { color:'#fff', border:'none', borderRadius:8, padding:'10px 14px', cursor:'pointer' };
const btnGhost = { padding:'8px 10px', borderRadius:8, border:'1px solid #e5e7eb', background:'#fff', cursor:'pointer' };
const btnAdd   = { padding:'8px 12px', borderRadius:8, border:'1px solid #c7d2fe', background:'#e9efff', fontWeight:600, cursor:'pointer', marginTop:6 };
const error= { background:'#fee2e2', color:'#991b1b', padding:'10px 12px', borderRadius:8, marginBottom:16 };
const reqRow = { display:'grid', gridTemplateColumns:'18px 1fr auto', gap:8, marginBottom:8, alignItems:'center' };
const dot   = { textAlign:'center', lineHeight:'36px', fontWeight:700 };
const label = { display:'block', marginBottom:6, fontWeight:600 };
