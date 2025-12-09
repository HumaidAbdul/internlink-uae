import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FilterBarHorizontal from '../components/FilterSidebar.jsx';
import pinIcon from './img/pin.png';


const badgeStyle = (t = '') => {
  const k = String(t).toLowerCase();
  if (k === 'full-time') return { background: '#D1FADF', color: '#067647' };
  if (k === 'part-time') return { background: '#FEF0C7', color: '#93370D' };
  return { background: '#E0E7FF', color: '#3730A3' };
};

export default function InternshipList() {
  
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    industry: '', location: '', work_mode: '', salary: '', job_type: '',
    startDate: '', duration: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/internship/all', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setInternships(res.data?.internships || []);
        setError('');
      } catch {
        setError('Failed to load internships');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const isUnset = (v) => v === '' || v === 'All';
  const same = (a, b) =>
    String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();

  const passes = (i) => {
    if (!isUnset(filters.industry)  && !same(i.industry,  filters.industry))  return false;
    if (!isUnset(filters.location)  && !same(i.location,  filters.location))  return false;
    if (!isUnset(filters.work_mode) && !same(i.work_mode, filters.work_mode)) return false;
    if (!isUnset(filters.job_type)  && !same(i.job_type,  filters.job_type))  return false;
    if (!isUnset(filters.salary)    && !same(i.payment_type || i.salary, filters.salary)) return false;
    if (!isUnset(filters.duration)  && !String(i.duration || '').includes(filters.duration)) return false;

    if (filters.startDate) {
      const a = new Date(i.start_date);
      const b = new Date(filters.startDate);
      if (!isNaN(a) && !isNaN(b) && a < b) return false;
    }
    return true;
  };

  const data = useMemo(
    () => (internships || [])
      .filter(i => !i.status || String(i.status).toLowerCase() === 'approved')
      .filter(passes),
    [internships, filters]
  );

  return (
    <div className="pg">
      <style>{`
        :root{
          --bg:#F6F7F9;--ink:#111827;--muted:#6B7280;--card:#fff;--br:#E5E7EB;
        }
        .pg{background:var(--bg);min-height:100svh;padding:16px;}
        @media (min-width:480px){ .pg{padding:auto;} }
        @media (min-width:1024px){ .pg{padding:auto;} }

       
        .meta{font-size:12px;color:var(--muted)}
        .sort{border:1px solid var(--br);border-radius:10px;padding:8px 10px;background:#F9FAFB;font-size:14px}
        @media (min-width:640px){ .hdr{grid-template-columns:auto 1fr}.hdrR{justify-content:flex-end} }

        /* responsive grid */
        .grid{display:grid;gap:12px;margin-top:12px;grid-template-columns:1fr}
        @media (min-width:540px){ .grid{grid-template-columns:repeat(2,minmax(0,1fr))} }
        @media (min-width:900px){ .grid{grid-template-columns:repeat(3,minmax(0,1fr))} }
        @media (min-width:1200px){ .grid{grid-template-columns:repeat(4,minmax(0,1fr))} }

        .card{display:flex;flex-direction:column;text-decoration:none;color:var(--ink);
              border:1px solid var(--br);border-radius:14px;background:var(--card);
              padding:14px;box-shadow:0 6px 18px rgba(0,0,0,.04);
              transition:transform .12s ease, box-shadow .12s ease;min-height:180px}
        @media (hover:hover){ .card:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(0,0,0,.08)} }

        .row{display:flex;align-items:center;gap:8px;margin-bottom:6px}
        .loc{font-size:12px;color:var(--muted);display:flex;align-items:center;gap:6px}
        .pin{width:16px;height:16px;object-fit:contain}
        .pill{padding:4px 8px;border-radius:999px;font-weight:700;font-size:11px;margin-left:auto;white-space:nowrap}

        .ttl{margin:4px 0 6px;font-size:clamp(16px,2.4vw,18px);line-height:1.25}
        .meta2{font-size:13px;color:var(--muted);margin-bottom:8px}
        .desc{font-size:14px;color:#4B5563;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;
              overflow:hidden;min-height:60px}
        .foot{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:8px}
        .tiny{font-size:12px;color:var(--muted)}

        .alert{margin-top:12px;padding:12px 14px;border-radius:10px;background:#FEE2E2;color:#991B1B;border:1px solid #FCA5A5}
        .empty{grid-column:1 / -1;background:var(--card);border:1px solid var(--br);border-radius:14px;padding:24px;text-align:center;color:var(--muted)}

        .skeleton{border:1px solid var(--br);border-radius:14px;padding:16px;background:var(--card)}
        .sk{background:linear-gradient(90deg,#eee,#f5f5f5,#eee);background-size:200px 100%;
             border-radius:6px;margin-bottom:10px;animation:shimmer 1.2s infinite}
        @keyframes shimmer{0%{background-position:-200px 0}100%{background-position:calc(200px + 100%) 0}}
      `}</style>

      <div className="wrap">
        <FilterBarHorizontal
          filters={filters}
          onFilterChange={setFilters}
          internships={internships}
        />

    

        {error && <div className="alert">{error}</div>}

        {!error && (
          <div className="grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="skeleton">
                  <div className="sk" style={{ width: '40%', height: 10 }} />
                  <div className="sk" style={{ width: '80%', height: 18 }} />
                  <div className="sk" style={{ width: '65%', height: 12 }} />
                  <div className="sk" style={{ width: '100%', height: 12 }} />
                  <div className="sk" style={{ width: '90%', height: 12 }} />
                </div>
              ))
            ) : data.length === 0 ? (
              <div className="empty">No internships match your filters.</div>
            ) : (
              data.map((i) => (
                <Link
                  key={i.id}
                  to={`/internships/${i.id}`}
                  className="card"
                >
                  <div className="row">
                    <div className="loc">
                      <img className="pin" src={pinIcon} alt="" />
                      <span>{i.location || '—'}</span>
                    </div>
                    <span className="pill" style={badgeStyle(i.job_type)}>
                      {i.job_type || 'Other'}
                    </span>
                  </div>

                  <h4 className="ttl">{i.title}</h4>

                  <div className="meta2">
                    <strong>Industry:</strong> {i.industry || '—'}
                    {i.work_mode ? <> · <strong>Mode:</strong> {i.work_mode}</> : null}
                  </div>

                  <div className="desc">
                    {(i.description || '').trim() || 'No description provided.'}
                  </div>

                  <div className="foot">
                    <span className="tiny">
                      {i.duration ? `Duration: ${i.duration}` : ''}
                      {i.start_date ? ` · Starts: ${new Date(i.start_date).toLocaleDateString()}` : ''}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
