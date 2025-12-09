import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";

export default function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // ✅ تأكدي أن عندك راوت في الباك إند: GET /api/admin/users/:id
        const res = await api.get(`/api/admin/users/${id}`);
        setUser(res.data || res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const badgeStyle = (status) => {
    if (!status) return {};
    switch (status.toLowerCase()) {
      case "approved":
      case "active":
        return { background: "#DCFCE7", color: "#166534" };
      case "rejected":
      case "blocked":
        return { background: "#FEE2E2", color: "#991B1B" };
      case "pending":
      default:
        return { background: "#FEF9C3", color: "#854D0E" };
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Loading user details...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>User not found.</p>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  return (
    <div className="user-details-page">
      <style>{`
        .user-details-page{
          max-width: 900px;
          margin: 30px auto;
          padding: 0 16px 40px;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI";
        }
        .ud-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:20px;
        }
        .ud-header h1{
          font-size:24px;
          font-weight:700;
          margin:0;
        }
        .ud-back{
          border:none;
          background:none;
          color:#1e3a8a;
          cursor:pointer;
          font-size:15px;
        }
        .ud-card{
          background:#fff;
          border-radius:16px;
          padding:20px 22px 22px;
          box-shadow:0 18px 45px rgba(15,23,42,.06);
        }
        .ud-top{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:18px;
          gap:12px;
          flex-wrap:wrap;
        }
        .ud-name{
          font-size:20px;
          font-weight:600;
          margin-bottom:4px;
        }
        .ud-muted{
          color:#6b7280;
          font-size:14px;
        }
        .ud-status{
          padding:6px 14px;
          border-radius:999px;
          font-size:13px;
          font-weight:600;
        }
        .ud-section-title{
          margin-top:10px;
          margin-bottom:8px;
          font-size:16px;
          font-weight:600;
        }
        .ud-info-box{
          background:#f9fafb;
          border-radius:12px;
          border:1px solid #e5e7eb;
          padding:10px 12px;
        }
        .ud-row{
          display:flex;
          justify-content:space-between;
          gap:10px;
          padding:6px 0;
          border-bottom:1px dashed #e5e7eb;
          font-size:14px;
        }
        .ud-row:last-child{
          border-bottom:none;
        }
        .ud-label{
          font-weight:600;
          color:#374151;
        }
        .ud-value{
          color:#111827;
          text-align:right;
        }
      `}</style>

      <div className="ud-header">
        <button className="ud-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>User Details</h1>
      </div>

      <div className="ud-card">
        <div className="ud-top">
          <div>
            <div className="ud-name">{user.name}</div>
            <div className="ud-muted">
              {user.role === "student" ? "Student" :
               user.role === "employer" ? "Employer" :
               user.role}
            </div>
          </div>
          <div className="ud-status" style={badgeStyle(user.status)}>
            {user.status}
          </div>
        </div>

        <div className="ud-section-title">Account Info</div>
        <div className="ud-info-box">
          <InfoRow label="User ID" value={user.id} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Role" value={user.role} />
          <InfoRow label="Status" value={user.status} />
          <InfoRow
            label="Created At"
            value={formatDateTime(user.created_at)}
          />
          <InfoRow
            label="Updated At"
            value={formatDateTime(user.updated_at)}
          />
        </div>

        {/* تقدرين تضيفين معلومات إضافية لو عندك أعمدة ثانية في الجدول */}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="ud-row">
      <span className="ud-label">{label}</span>
      <span className="ud-value">{value || "—"}</span>
    </div>
  );
}

function formatDateTime(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleString();
}
