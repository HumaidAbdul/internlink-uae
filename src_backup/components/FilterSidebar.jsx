import React from 'react';

export default function FilterBarHorizontal({ filters, onFilterChange, internships }) {
  const uniq = (arr, key) => [...new Set((arr || []).map(i => i?.[key]).filter(Boolean))];

  const industries = uniq(internships, 'industry');
  const locations  = uniq(internships, 'location');
  const modes      = uniq(internships, 'work_mode');
  const types      = uniq(internships, 'job_type');
  const durations  = uniq(internships, 'duration');
  const salaries   = uniq(internships, 'salary').length
    ? uniq(internships, 'salary')
    : uniq(internships, 'payment_type');

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(prev => ({ ...prev, [name]: value }));
  };

  const reset = () =>
    onFilterChange({
      industry: '', location: '', work_mode: '', job_type: '',
      duration: '', salary: '', startDate: ''
    });

  return (
    <section className="flt">
      <style>{`
        :root{
          --card:#fff; --br:#e5e7eb; --ink:#111827; --muted:#64748b;
        }
        .flt{
          background:var(--card);
          border:1px solid var(--br);
          border-radius:12px;
          padding:12px;
          margin-bottom:12px;
        }

        /* Responsive grid: 1 → 2 → 3 → 4 columns */
        .flt-grid{
          display:grid;
          grid-template-columns: 1fr;
          gap:10px;
        }
        @media (min-width:480px){ .flt-grid{ grid-template-columns: repeat(2, minmax(0,1fr)); } }
        @media (min-width:768px){ .flt-grid{ grid-template-columns: repeat(3, minmax(0,1fr)); } }
        @media (min-width:1024px){ .flt-grid{ grid-template-columns: repeat(4, minmax(0,1fr)); } }

        .ctrl{ display:flex; flex-direction:column; gap:6px; min-width:0; }
        .lbl{ font-size:12px; color:var(--muted); }
        .in{
          width:100%;
          padding:10px 12px;
          border:1px solid var(--br);
          border-radius:10px;
          background:#fff;
          color:var(--ink);
          font-size:14px;
          outline:none;
        }
        .in:focus{ box-shadow:0 0 0 3px rgba(37,99,235,.18); border-color:#93c5fd; }

        /* Date control keeps the inline label on one line */
        .ctrl-inline{ display:flex; align-items:center; gap:8px; }
        .ctrl-inline .lbl{ margin:0; white-space:nowrap; }

        /* Actions row spans full width on small screens, right-aligned on md+ */
        .actions{ grid-column: 1 / -1; display:flex; gap:8px; justify-content:space-between; }
        @media (min-width:768px){ .actions{ justify-content:flex-end; } }

        .btn-clear{
          padding:10px 12px;
          border:1px solid var(--br);
          border-radius:10px;
          background:#f5f7fb;
          cursor:pointer;
          font-size:14px;
          font-weight:600;
        }
      `}</style>

      <div className="flt-grid">
        <div className="ctrl">
          <label className="lbl" htmlFor="industry">Industry</label>
          <select id="industry" name="industry" value={filters.industry} onChange={handleChange} className="in">
            <option value="">All</option>
            {industries.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div className="ctrl">
          <label className="lbl" htmlFor="location">Location</label>
          <select id="location" name="location" value={filters.location} onChange={handleChange} className="in">
            <option value="">All</option>
            {locations.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div className="ctrl">
          <label className="lbl" htmlFor="work_mode">Work Mode</label>
          <select id="work_mode" name="work_mode" value={filters.work_mode} onChange={handleChange} className="in">
            <option value="">All</option>
            {modes.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div className="ctrl">
          <label className="lbl" htmlFor="job_type">Job Type</label>
          <select id="job_type" name="job_type" value={filters.job_type} onChange={handleChange} className="in">
            <option value="">All</option>
            {types.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div className="ctrl">
          <label className="lbl" htmlFor="duration">Duration</label>
          <select id="duration" name="duration" value={filters.duration} onChange={handleChange} className="in">
            <option value="">All</option>
            {durations.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div className="ctrl">
          <label className="lbl" htmlFor="salary">Salary</label>
          <select id="salary" name="salary" value={filters.salary} onChange={handleChange} className="in">
            <option value="">All</option>
            {salaries.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

       
        <div className="actions">
          <button type="button" className="btn-clear" onClick={reset}>Clear</button>
        </div>
      </div>
    </section>
  );
}
