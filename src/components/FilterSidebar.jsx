import React from 'react';
const MANUAL_INDUSTRIES = [
  "Information Technology",
  "Engineering",
  "Finance",
  "Marketing",
  "Healthcare",
  "Education",
  "Business",
  "Technology",
];

const MANUAL_LOCATIONS = [
  "Abu dhabi",
  "Dubai",
  "Sharjah",
  "Alain",
  "Ajman",
  "RAK",
  "Fujairah",
  "Sharjah",
  "UAQ",
  "Remote (UAE)",
];

const MANUAL_MODES = [
  { label: "On-site", value: "Onsite" }, // القيمة نفس اللي في DB
  { label: "Remote", value: "Remote" },
  { label: "Hybrid", value: "Hybrid" },
];


const MANUAL_TYPES = [
  "Internship",
  "Part-time",
  "Full-time",
  "Traineeship",
];

const MANUAL_DURATIONS = [
  { label: "1 month", value: "1" },
  { label: "2 months", value: "2" },
  { label: "3 months", value: "3" },
  { label: "4 months", value: "4" },
  { label: "6 months", value: "6" },
  { label: "12 months", value: "12" },
];


const MANUAL_SALARIES = [
  { id: "unpaid",     label: "Unpaid" },          
  { id: "1000-2000",  label: "1000 - 2000 AED" },
  { id: "2000-4000",  label: "2000 - 4000 AED" },
  { id: "4000plus",   label: "4000+ AED" },
];

export default function FilterBarHorizontal({ filters, onFilterChange, internships }) {
  const uniq = (arr, key) => [...new Set((arr || []).map(i => i?.[key]).filter(Boolean))];



const industries =MANUAL_INDUSTRIES
const locations  =MANUAL_LOCATIONS
const modes      =MANUAL_MODES
const types      =MANUAL_TYPES
const durations  =MANUAL_DURATIONS
const salaries =MANUAL_SALARIES

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(prev => ({ ...prev, [name]: value }));
  };

  const reset = () =>
    onFilterChange({
      industry: '', location: '', work_mode: '', job_type: '',
      duration: '', salary: '', startDate: ''
    });

    const filterBySalary = (intern, salaryFilter) => {
  if (!salaryFilter) return true;

  const raw = intern.salary; // إما "Unpaid" أو "2000" أو "4500"
  if (!raw) return false;

  if (salaryFilter === "unpaid") {
    return raw === "Unpaid";
  }

  const num = Number(raw); // يحوله رقم

  if (Number.isNaN(num)) return false;

  switch (salaryFilter) {
    case "1000-2000":
      return num >= 1000 && num <= 2000;
    case "2000-4000":
      return num > 2000 && num <= 4000;
    case "4000plus":
      return num > 4000;
    default:
      return true;
  }
};

const filteredInternships = internships.filter(intern => {
  let ok = true;


  if (!filterBySalary(intern, filters.salary)) ok = false;

  return ok;
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
        <label className="lbl" htmlFor="job_type">Work Mode</label>
        <select id="work_mode" name="work_mode" value={filters.work_mode} onChange={handleChange} className="in">
        <option value="">All</option>
        {modes.map(m => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
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
        <label className="lbl" htmlFor="job_type">Work Mode</label>
        <select id="duration" name="duration" value={filters.duration} onChange={handleChange} className="in">
          <option value="">All</option>
          {durations.map(d => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
          </select>
          </div>

        <div className="ctrl">
          <label className="lbl" htmlFor="salary">Salary</label>
          <select
              id="salary"
              name="salary"
              value={filters.salary}
              onChange={handleChange}
              className="in"
            >
              <option value="">All</option>
              {salaries.map(s => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
        </div>

       
        <div className="actions">
          <button type="button" className="btn-clear" onClick={reset}>Clear</button>
        </div>
      </div>
    </section>
  );
}