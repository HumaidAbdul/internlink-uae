// src/pages/ApplicationDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../lib/api";

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // ✅ مهم: نستخدم /api/admin/applications/:id
        const res = await api.get(`/api/admin/applications/${id}`);
        setApp(res.data || res);
      } catch (err) {
        console.error("Error loading application:", err);
        toast.error(
          err?.response?.data?.message || "Failed to load application."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleBack = () => {
    // يرجع لصفحة الديركتوري
    navigate("/admin/directory");
  };

  if (loading) return <p style={{ padding: 16 }}>Loading…</p>;

  if (!app) {
    return (
      <div style={{ padding: 16 }}>
        <p>Application not found.</p>
        <button onClick={handleBack}>Back</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: "0 16px" }}>
      {/* هيدر */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1 style={{ margin: 0 }}>Application Details</h1>
        <button
          onClick={handleBack}
          style={{
            padding: "8px 16px",
            borderRadius: 999,
            border: "1px solid #e5e7eb",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Back to Directory
        </button>
      </div>

      {/* كارد التفاصيل */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 20,
          boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* الطالب */}
        <section style={{ marginBottom: 20 }}>
          <h3>Student</h3>
          <p>
            <strong>Name: </strong>
            {app.student_name}
          </p>
          <p>
            <strong>Email: </strong>
            {app.student_email}
          </p>
        </section>

        {/* الشركة + الانترنشب */}
        <section style={{ marginBottom: 20 }}>
          <h3>Internship</h3>
          <p>
            <strong>Title: </strong>
            {app.internship_title || app.title}
          </p>
          <p>
            <strong>Location: </strong>
            {app.internship_location || app.location}
          </p>
          <p>
            <strong>Company: </strong>
            {app.company_name}
          </p>
        </section>

        {/* حالة الأبلكيشن */}
        <section>
          <h3>Application</h3>
          <p>
            <strong>Status: </strong>
            {app.status}
          </p>
          <p>
            <strong>Applied at: </strong>
            {app.applied_at
              ? new Date(app.applied_at).toLocaleDateString()
              : "-"}
          </p>
          <p>
            <strong>Rejection reason: </strong>
            {app.rejection_reason || "-"}
          </p>
        </section>
      </div>
    </div>
  );
}
