// src/pages/AdminDirectory.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../lib/api";

export default function AdminDirectory() {
  const [students, setStudents] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userStatusFilter, setUserStatusFilter] = useState("all");
  const [internshipStatusFilter, setInternshipStatusFilter] = useState("all");
  const [applicationStatusFilter, setApplicationStatusFilter] =
    useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);

        const [usersRes, internshipsRes, applicationsRes] = await Promise.all([
          api.get("/api/admin/users"),
          api.get("/api/admin/pending-internships"),
          api.get("/api/admin/pending-applications"),
        ]);

        const users = usersRes.data || usersRes;
        setStudents(users.filter((u) => u.role === "student"));
        setEmployers(users.filter((u) => u.role === "employer"));

        setInternships(internshipsRes.data || internshipsRes);
        setApplications(applicationsRes.data || applicationsRes);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load directory data");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  const badgeStyle = (status) => {
    if (!status) return {};
    switch (status.toLowerCase()) {
      case "approved":
        return { color: "#16a34a", fontWeight: 600 };
      case "rejected":
        return { color: "#dc2626", fontWeight: 600 };
      default:
        return { color: "#ca8a04", fontWeight: 600 };
    }
  };

  const approveUser = async (id, name) => {
    if (!window.confirm(`Approve user "${name}"?`)) return;
    try {
      await api.post(`/api/admin/users/${id}/approve`);
      setStudents((list) =>
        list.map((u) => (u.id === id ? { ...u, status: "approved" } : u))
      );
      setEmployers((list) =>
        list.map((u) => (u.id === id ? { ...u, status: "approved" } : u))
      );
      toast.success("User approved");
    } catch (e) {
      console.error(e);
      toast.error("Failed to approve user");
    }
  };

  const rejectUser = async (id, name) => {
    if (!window.confirm(`Reject user "${name}"?`)) return;
    try {
      await api.post(`/api/admin/users/${id}/reject`);
      setStudents((list) =>
        list.map((u) => (u.id === id ? { ...u, status: "rejected" } : u))
      );
      setEmployers((list) =>
        list.map((u) => (u.id === id ? { ...u, status: "rejected" } : u))
      );
      toast.success("User rejected");
    } catch (e) {
      console.error(e);
      toast.error("Failed to reject user");
    }
  };

  const approveInternship = async (id, title) => {
    if (!window.confirm(`Approve internship "${title}"?`)) return;
    try {
      await api.post(`/api/admin/internships/${id}/approve`);
      setInternships((list) =>
        list.map((i) => (i.id === id ? { ...i, status: "approved" } : i))
      );
      toast.success("Internship approved");
    } catch (e) {
      console.error(e);
      toast.error("Failed");
    }
  };

  const rejectInternship = async (id, title) => {
    if (!window.confirm(`Reject internship "${title}"?`)) return;
    const reason = window.prompt("Reason (optional):", "");
    try {
      await api.post(`/api/admin/internships/${id}/reject`, { reason });
      setInternships((list) =>
        list.map((i) => (i.id === id ? { ...i, status: "rejected" } : i))
      );
      toast.success("Internship rejected");
    } catch (e) {
      console.error(e);
      toast.error("Failed");
    }
  };

  const approveApplication = async (id, title) => {
    if (!window.confirm(`Approve application for "${title}"?`)) return;
    try {
      await api.post(`/api/admin/applications/${id}/approve`);
      setApplications((list) =>
        list.map((a) => (a.id === id ? { ...a, status: "approved" } : a))
      );
      toast.success("Application approved");
    } catch (e) {
      console.error(e);
      toast.error("Failed");
    }
  };

  const rejectApplication = async (id, title) => {
    if (!window.confirm(`Reject application for "${title}"?`)) return;
    const reason = window.prompt("Reason (optional):", "");
    try {
      await api.post(`/api/admin/applications/${id}/reject`, { reason });
      setApplications((list) =>
        list.map((a) => (a.id === id ? { ...a, status: "rejected" } : a))
      );
      toast.success("Application rejected");
    } catch (e) {
      console.error(e);
      toast.error("Failed");
    }
  };

  const allUsers = [...students, ...employers];

  const filteredUsers = allUsers.filter((u) =>
    userStatusFilter === "all"
      ? true
      : (u.status || "pending").toLowerCase() === userStatusFilter
  );

  const filteredInternships = internships.filter((i) =>
    internshipStatusFilter === "all"
      ? true
      : (i.status || "pending").toLowerCase() === internshipStatusFilter
  );

  const filteredApplications = applications.filter((a) =>
    applicationStatusFilter === "all"
      ? true
      : (a.status || "pending").toLowerCase() === applicationStatusFilter
  );

  return (
    <div className="admin-dir-page">
<style>{`
  .admin-dir{
    width:100%;
    max-width:1200px;
    margin:30px auto 40px;
    padding:0 16px;
    font-family:system-ui,-apple-system,"Segoe UI",sans-serif;
    box-sizing:border-box;
  }
  h1{
    font-size:26px;
    font-weight:700;
    margin-bottom:20px;
  }

  .grid-3{
    display:grid;
    gap:20px;
  }
  @media(min-width:1024px){
    .grid-3{grid-template-columns:repeat(3,1fr);}
  }
  @media(max-width:1023px){
    .grid-3{grid-template-columns:1fr;}
  }

  .card{
    background:#fff;
    border-radius:16px;
    padding:14px;
    box-shadow:0 12px 35px rgba(15,23,42,.06);
  }
  @media(max-width:600px){
    .card{padding:12px;}
  }

  .card-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    font-weight:700;
    margin-bottom:10px;
    gap:8px;
  }

  .table-wrapper{
    width:100%;
  }

  /* ====== Desktop / عادي ====== */
  table{
    width:100%;
    border-collapse:collapse;
    font-size:13px;
  }
    th:nth-child(1), td:nth-child(1) { width: 28%; }
th:nth-child(2), td:nth-child(2) { width: 14%; text-align: left; }
th:nth-child(3), td:nth-child(3) { width: 20%; }
th:nth-child(4), td:nth-child(4) { width: 15%; }
th:nth-child(5), td:nth-child(5) { width: 23%; }

td, th {
  word-break: break-word;
  white-space: normal;
}

  thead{
    background:#0f2b63;
    color:#fff;
  }
    tbody tr {
  height: 45px;
}
  tbody tr:nth-child(even){background:#f9fafb;}
  tbody tr:nth-child(odd){background:#fff;}

  .btn-view{
    padding:4px 10px;
    border-radius:999px;
    border:1px solid #e5e7eb;
    background:#f9fafb;
    cursor:pointer;
    font-size:12px;
    white-space:nowrap;
  }
  .btn-approve{
    padding:4px 10px;
    background:#16a34a;
    color:#fff;
    border:none;
    border-radius:999px;
    cursor:pointer;
    font-size:12px;
    white-space:nowrap;
  }
  .btn-reject{
    padding:4px 10px;
    background:#dc2626;
    color:#fff;
    border:none;
    border-radius:999px;
    cursor:pointer;
    font-size:12px;
    white-space:nowrap;
  }
  .actions{
    display:flex;
    gap:6px;
    flex-wrap:wrap;
  }

  .filter-select{
    font-size:12px;
    padding:4px 8px;
    border-radius:999px;
    border:1px solid #d1d5db;
    background:#f9fafb;
    outline:none;
  }

  /* ====== Mobile: حوّل الصف إلى Card مرتب ====== */
  @media (max-width: 700px) {
    .table-wrapper{
      overflow:visible;
    }

    table,
    tbody{
      display:block;
      width:100%;
    }

    thead{
      display:none;
    }

    tbody tr{
      display:block;
      margin-bottom:12px;
      padding:10px 12px;
      border-radius:14px;
      background:#ffffff;
      box-shadow:0 6px 16px rgba(15,23,42,.07);
    }

    td{
      display:block;
      border:none;
      padding:4px 0;
      font-size:13px;
    }

    /* label فوق القيمة */
    td::before{
      content: attr(data-label);
      display:block;
      font-size:11px;
      text-transform:uppercase;
      letter-spacing:0.04em;
      color:#9ca3af;
      margin-bottom:2px;
    }

    /* name أكبر شوي */
    td:first-child{
      font-weight:600;
      font-size:14px;
      margin-bottom:4px;
    }
    td:first-child::before{
      font-size:10px;
    }

    /* role سطر صغير تحت الاسم */
    td:nth-child(2){
      color:#6b7280;
      font-size:12px;
    }

    /* status نخليه أقرب للاسم */
    td:nth-child(3){
      margin-top:4px;
    }

    /* actions تحت وبعرض الكارد */
    .actions{
      margin-top:6px;
      justify-content:flex-start;
    }
  }
`}</style>


      <div className="admin-dir">
        <h1>Platform Directory</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid-3">
            {/* USERS */}
            <div className="card">
              <div className="card-header">
                <span>Users (Students & Employers)</span>
                <select
                  className="filter-select"
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>View</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.role === "student" ? "Student" : "Employer"}</td>
                        <td style={badgeStyle(u.status)}>{u.status}</td>
                        <td>
                          <button
                            className="btn-view"
                            onClick={() => navigate(`/admin/users/${u.id}`)}
                          >
                            View
                          </button>
                        </td>
                        <td>
                          <div className="actions">
                            {!u.status || u.status === "pending" ? (
                              <>
                                <button
                                  className="btn-approve"
                                  onClick={() => approveUser(u.id, u.name)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn-reject"
                                  onClick={() => rejectUser(u.id, u.name)}
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span>—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* INTERNSHIPS */}
            <div className="card">
              <div className="card-header">
                <span>Internships</span>
                <select
                  className="filter-select"
                  value={internshipStatusFilter}
                  onChange={(e) => setInternshipStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Company</th>
                      <th>Status</th>
                      <th>View</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInternships.map((i) => (
                      <tr key={i.id}>
                        <td>{i.title}</td>
                        <td>{i.company_name}</td>
                        <td style={badgeStyle(i.status)}>{i.status}</td>
                        <td>
                          <button
                            className="btn-view"
                            onClick={() =>
                              navigate(`/admin/internships/${i.id}`)
                            }
                          >
                            View
                          </button>
                        </td>
                        <td>
                          <div className="actions">
                            {i.status === "pending" ? (
                              <>
                                <button
                                  className="btn-approve"
                                  onClick={() =>
                                    approveInternship(i.id, i.title)
                                  }
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn-reject"
                                  onClick={() =>
                                    rejectInternship(i.id, i.title)
                                  }
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span>—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* APPLICATIONS */}
            <div className="card">
              <div className="card-header">
                <span>Applications</span>
                <select
                  className="filter-select"
                  value={applicationStatusFilter}
                  onChange={(e) => setApplicationStatusFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Internship</th>
                      <th>Status</th>
                      <th>View</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((a) => (
                      <tr key={a.id}>
                        <td>{a.student_name}</td>
                        <td>{a.title}</td>
                        <td style={badgeStyle(a.status)}>{a.status}</td>
                        <td>
                          <button
                            className="btn-view"
                            onClick={() =>
                              navigate(`/admin/applications/${a.id}`)
                            }
                          >
                            View
                          </button>
                        </td>
                        <td>
                          <div className="actions">
                            {a.status === "pending" ? (
                              <>
                                <button
                                  className="btn-approve"
                                  onClick={() =>
                                    approveApplication(a.id, a.title)
                                  }
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn-reject"
                                  onClick={() =>
                                    rejectApplication(a.id, a.title)
                                  }
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span>—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
