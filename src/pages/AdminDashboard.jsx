// src/pages/AdminDashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import api from "../lib/api";
import "./admin.css";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const TABS = [
  { key: "users", label: "Users" },
  { key: "internships", label: "Internships" },
  { key: "reports", label: "Reports" },
];

const badgeStyle = (t = "") => {
  const k = String(t).toLowerCase();
  if (k === "rejected") return { borderRadius: "50px", color: "#b24a1a" };
  if (k === "approved") return { borderRadius: "50px", color: "#1aa46a" };
  return { borderRadius: "50px", color: "#9e8b2a" };
};

// 🔹 خريطة لتحويل الـ location إلى إمارة
const EMIRATE_MAP = {
  "abu dhabi": "Abu Dhabi",
  "abudhabi": "Abu Dhabi",
  "al ain": "Abu Dhabi",
  "al-ain": "Abu Dhabi",
  "al ain, abu dhabi": "Abu Dhabi",

  dubai: "Dubai",

  sharjah: "Sharjah",

  ajman: "Ajman",

  "umm al quwain": "UAQ",
  "umm-al-quwain": "UAQ",
  "uaq": "UAQ",

  "ras al khaimah": "RAK",
  "ras-al-khaimah": "RAK",
  rak: "RAK",

  fujairah: "Fujairah",
};

const EMIRATE_COLORS = [
  "#2563eb", // Abu Dhabi
  "#10b981", // Dubai
  "#f59e0b", // Sharjah
  "#ef4444", // Ajman
  "#a855f7", // UAQ
  "#f97316", // RAK
  "#22c55e", // Fujairah
];

export default function AdminDashboard() {
  const [active, setActive] = useState("users");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    students: 0,
    employers: 0,
    internships: 0,
    applications: 0,
  });

  const [pendingInternships, setPendingInternships] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);

  // confirm modal
  const [confirm, setConfirm] = useState(null); // { type, id, itemLabel }
  const [reason, setReason] = useState("");

  // ======== Bar chart data (overview) ========
  const barData = useMemo(
    () => [
      { name: "Students", value: summary.students },
      { name: "Employers", value: summary.employers },
      { name: "Internships", value: summary.internships },
      { name: "Applications", value: summary.applications },
    ],
    [summary]
  );

  // ======== Pie chart data: internships by emirate ========
  const internshipsByEmirate = useMemo(() => {
    const counts = {
      "Abu Dhabi": 0,
      Dubai: 0,
      Sharjah: 0,
      Ajman: 0,
      UAQ: 0,
      RAK: 0,
      Fujairah: 0,
    };

    pendingInternships.forEach((item) => {
      if (!item.location) return;

      const loc = item.location.toLowerCase().trim();
      // محاولة مباشرة
      let emirate = EMIRATE_MAP[loc] || null;

      // لو الـ location جملة طويلة (مثلاً "Al Ain, Abu Dhabi, UAE")
      if (!emirate) {
        if (loc.includes("abu dhabi") || loc.includes("al ain"))
          emirate = "Abu Dhabi";
        else if (loc.includes("dubai")) emirate = "Dubai";
        else if (loc.includes("sharjah")) emirate = "Sharjah";
        else if (loc.includes("ajman")) emirate = "Ajman";
        else if (loc.includes("umm al quwain") || loc.includes("uaq"))
          emirate = "UAQ";
        else if (loc.includes("ras al khaimah") || loc.includes("rak"))
          emirate = "RAK";
        else if (loc.includes("fujairah")) emirate = "Fujairah";
      }

      if (emirate && counts[emirate] !== undefined) {
        counts[emirate] += 1;
      }
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [pendingInternships]);

  // ======== Load data from API ========
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const s = await api.get("/api/admin/summary");
        setSummary(s.data || s);

        const intp = await api.get("/api/admin/pending-internships");
        setPendingInternships(intp.data || intp);

        const apps = await api.get("/api/admin/pending-applications");
        setPendingApplications(apps.data || apps);
      } catch (e) {
        toast.error(
          e?.response?.data?.message || "Failed to load admin data"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ======== Approve / Reject handler ========
  const doAction = async () => {
    if (!confirm) return;
    try {
      let url = "";
      let body = undefined;

      if (confirm.type === "approveApp")
        url = `/api/admin/applications/${confirm.id}/approve`;
      if (confirm.type === "rejectApp") {
        url = `/api/admin/applications/${confirm.id}/reject`;
        body = { reason };
      }
      if (confirm.type === "approveInt")
        url = `/api/admin/internships/${confirm.id}/approve`;
      if (confirm.type === "rejectInt") {
        url = `/api/admin/internships/${confirm.id}/reject`;
        body = { reason };
      }

      await api.post(url, body);
      if (confirm.type.includes("App")) {
        setPendingApplications((arr) =>
          arr.filter((x) => x.id !== confirm.id)
        );
      } else {
        setPendingInternships((arr) =>
          arr.filter((x) => x.id !== confirm.id)
        );
      }
      toast.success("Action completed");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Action failed");
    } finally {
      setConfirm(null);
      setReason("");
    }
  };
 
   return (
  <div className="admin">
    <style>{`
      .admin__wrap {
        max-width: 1100px;
        margin: 0 auto;
        padding: 16px 10px 24px;
      }

      .admin__title {
        font-size: 22px;
        font-weight: 700;
        margin-bottom: 14px;
      }

      .panel {
        background: #ffffff;
        border-radius: 18px;
        padding: 14px 14px 16px;
        box-shadow: 0 16px 40px rgba(15,23,42,0.06);
      }

      .panel__title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 10px;
      }

      /* صف التشارتات جنب بعض */
      .chart__row {
        display: flex;
        gap: 12px;
        align-items: stretch;
      }

      .chart__col {
        flex: 1 1 0;
        min-width: 0; /* مهم عشان ما يكسر الـ layout لما العرض يصغر */
      }

      .chart__inner {
        width: 100%;
        height: 220px; /* هذا اللي يحدد الارتفاع الفعلي */
      }

      .muted {
        font-size: 13px;
        color: #6b7280;
      }

      /* لو الشاشة ضيقة مرة (موبايل بدون DevTools) نخليهم فوق بعض */
      @media (max-width: 480px) {
        .chart__row {
          flex-direction: column;
        }
        .chart__inner {
          height: 200px;
        }
      }

      /* لو ارتفاع الشاشة صغير (زي حالتك مع DevTools مفتوحة) نصغّر شوي */
      @media (max-height: 750px) {
        .chart__inner {
          height: 190px;
        }
      }
    `}</style>

    <div className="admin__wrap">
      <h1 className="admin__title">Admin Control Panel</h1>

      <div className="panel panel--chart">
        <h3 className="panel__title">Platform Overview</h3>

        <div className="chart__row">
          {/* Bar Chart: Summary */}
          <div className="chart__col">
            <div className="chart__inner">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 6, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart: Internships by Emirate */}
          <div className="chart__col">
            <h4 style={{ textAlign: "center", marginBottom: 4 }}>
              Internships by Emirate
            </h4>

            {internshipsByEmirate.every((e) => e.value === 0) ? (
              <p className="muted" style={{ textAlign: "center" }}>
                No internship data to display.
              </p>
            ) : (
              <div className="chart__inner">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={internshipsByEmirate}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="48%"
                      outerRadius={70}   // أصغر شوي عشان المساحة
                      // شلّينا label عشان ما يطوّل التشارت
                    >
                      {internshipsByEmirate.map((entry, index) => (
                        <Cell
                          key={`em-${entry.name}`}
                          fill={EMIRATE_COLORS[index % EMIRATE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 10, paddingTop: 4 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
