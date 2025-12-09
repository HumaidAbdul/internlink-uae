import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";
import { toast } from "react-toastify";

export default function AdminInternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load internship details
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/admin/internships/${id}`);
        setData(res.data);
      } catch (err) {
        toast.error("Failed to load internship details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return <div style={{ padding: 40, fontSize: 20 }}>Loading internship...</div>;
  }

  if (!data) {
    return <div style={{ padding: 40, fontSize: 20 }}>Internship not found.</div>;
  }

  const handleApprove = async () => {
    try {
      await api.post(`/api/admin/internships/${id}/approve`);
      toast.success("Internship approved!");
      navigate("/admin/directory");
    } catch (err) {
      toast.error("Error approving internship");
    }
  };

  const handleReject = async () => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      await api.post(`/api/admin/internships/${id}/reject`, { reason });
      toast.success("Internship rejected");
      navigate("/admin/directory");
    } catch (err) {
      toast.error("Error rejecting internship");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Internship Details</h1>

        <div style={styles.section}>
          <h2 style={styles.header}>Internship Information</h2>
          <p><strong>Title:</strong> {data.title}</p>
          <p><strong>Location:</strong> {data.location}</p>
          <p><strong>Status:</strong> 
            <span style={{ ...styles.status, ...statusColors[data.status] }}>
              {data.status}
            </span>
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.header}>Company Information</h2>
          <p><strong>Company:</strong> {data.company_name}</p>
        </div>

        {data.rejection_reason && (
          <div style={styles.section}>
            <h2 style={styles.header}>Rejection Reason</h2>
            <p>{data.rejection_reason}</p>
          </div>
        )}

        {data.status === "pending" && (
          <div style={styles.actions}>
            <button style={styles.approveBtn} onClick={handleApprove}>Approve</button>
            <button style={styles.rejectBtn} onClick={handleReject}>Reject</button>
          </div>
        )}

        <button style={styles.backBtn} onClick={() => navigate("/admin/directory")}>
          ← Back to Directory
        </button>
      </div>
    </div>
  );
}

const statusColors = {
  approved: { background: "#d1fae5", color: "#065f46" },
  rejected: { background: "#fee2e2", color: "#991b1b" },
  pending:  { background: "#fef3c7", color: "#92400e" },
};

const styles = {
  page: {
    padding: "40px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: "700px",
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.10)",
  },
  title: {
    fontSize: "32px",
    marginBottom: "20px",
  },
  section: {
    marginTop: "20px",
    paddingBottom: "10px",
    borderBottom: "1px solid #eee",
  },
  header: {
    fontSize: "20px",
    marginBottom: "10px",
  },
  status: {
    padding: "4px 12px",
    borderRadius: "8px",
    fontWeight: "600",
    marginLeft: "8px",
  },
  actions: {
    marginTop: "25px",
    display: "flex",
    gap: "12px",
  },
  approveBtn: {
    background: "#16a34a",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  rejectBtn: {
    background: "#dc2626",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
  },
  backBtn: {
    marginTop: "25px",
    background: "#e5e7eb",
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
  },
};
