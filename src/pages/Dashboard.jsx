import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";
import { Search, Bell } from "lucide-react";

const Dashboard = ({ employees = [], leaves = [] }) => {
  const present = employees.filter((e) => e.status === "Present").length;
  const onLeave = employees.filter((e) => e.status === "Leave").length;
  const pending = leaves.filter((l) => l.status === "Pending").length;
  const total   = employees.length;

  const attendancePct = total > 0 ? Math.round((present / total) * 100) : 0;
  const onLeavePct    = total > 0 ? Math.round((onLeave / total) * 100) : 0;

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const deptMap = {};
  employees.forEach((e) => { deptMap[e.department] = (deptMap[e.department] || 0) + 1; });
  const depts = Object.entries(deptMap).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const maxDept = depts[0]?.[1] || 1;

  const pendingLeaves = leaves.filter((l) => l.status === "Pending").slice(0, 3);
  const recentEmployees = [...employees].slice(0, 4);
  const totalPayroll = employees.reduce((s, e) => s + (Number(e.salary) || 0), 0);

  const chartData = [
    { name: "Present",  value: present || 0 },
    { name: "On Leave", value: onLeave || 0 },
  ];

  const initials = (name = "") =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const avatarColors = [
    { bg: "#dbeafe", color: "#2563eb" },
    { bg: "#dcfce7", color: "#16a34a" },
    { bg: "#fef9c3", color: "#ca8a04" },
    { bg: "#fee2e2", color: "#dc2626" },
    { bg: "#f3e8ff", color: "#9333ea" },
  ];
  const getColor = (i) => avatarColors[i % avatarColors.length];

  const statusStyle = (s) =>
    s === "Present"
      ? { bg: "#dcfce7", color: "#16a34a" }
      : s === "On leave" || s === "Leave"
      ? { bg: "#fef9c3", color: "#ca8a04" }
      : { bg: "#fee2e2", color: "#dc2626" };

  const card = {
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #e8eaed",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── TOP BAR ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>Admin Portal · {today}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "#fff", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Search size={14} color="#64748b" />
          </div>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "#fff", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
            <Bell size={14} color="#64748b" />
            <div style={{ position: "absolute", top: 7, right: 7, width: 6, height: 6, borderRadius: "50%", background: "#ef4444", border: "1.5px solid #f1f5f9" }} />
          </div>
          <div style={{ height: 34, borderRadius: 9, background: "#fff", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 12, fontWeight: 700, color: "#0f172a", cursor: "pointer" }}>AD</div>
        </div>
      </div>

      {/* ── ZONE 1: KPI CARDS ── */}
      <p style={{ fontSize: 9, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
        Zone 1 — KPI Summary (Top Row, Always Visible)
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
        {[
          { tag: "Employees", tagColor: "#2563eb", tagBg: "#eff6ff", emoji: "👥", value: total,   valueColor: "#0f172a", sub: "Total headcount" },
          { tag: "Present",   tagColor: "#16a34a", tagBg: "#f0fdf4", emoji: "✅", value: present, valueColor: "#16a34a", sub: `Today · ${attendancePct}%` },
          { tag: "On leave",  tagColor: "#ca8a04", tagBg: "#fefce8", emoji: "📋", value: onLeave, valueColor: "#ca8a04", sub: "Active leaves" },
          { tag: "Pending",   tagColor: "#ef4444", tagBg: "#fef2f2", emoji: "🕐", value: pending, valueColor: "#ef4444", sub: "Leave requests" },
        ].map((c, i) => (
          <div key={i} style={{ ...card, padding: "14px 16px" }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: c.tagBg, color: c.tagColor, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 999 }}>
                <span style={{ fontSize: 12 }}>{c.emoji}</span>{c.tag}
              </span>
            </div>
            <p style={{ fontSize: 32, fontWeight: 700, color: c.valueColor, margin: "0 0 3px", lineHeight: 1 }}>{c.value}</p>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{c.sub}</p>
          </div>
        ))}
      </div>

      {/* ── ZONE 2: DAILY OVERVIEW ── */}
      <p style={{ fontSize: 9, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
        Zone 2 — Daily Overview (Middle Row)
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr 1fr", gap: 10, marginBottom: 16 }}>

        {/* Pending leave requests */}
        <div style={{ ...card, padding: "16px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 }}>Pending leave requests</h3>
            <span style={{ fontSize: 11, color: "#2563eb", cursor: "pointer" }}>view all</span>
          </div>
          {pendingLeaves.length === 0 ? (
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>No pending requests</p>
          ) : pendingLeaves.map((lv, i) => {
            const c = getColor(i);
            return (
              <div key={lv._id || i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < pendingLeaves.length - 1 ? 12 : 0 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: c.bg, color: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{initials(lv.employee)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#0f172a", margin: "0 0 1px" }}>{lv.employee}</p>
                  <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{lv.leaveType} · {lv.days || "—"} days</p>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: "#fef9c3", color: "#ca8a04", flexShrink: 0 }}>Pending</span>
              </div>
            );
          })}
        </div>

        {/* Attendance breakdown */}
        <div style={{ ...card, padding: "16px 16px" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 10px" }}>Attendance breakdown</h3>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <div style={{ width: 120, height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.some(d => d.value > 0) ? chartData : [{ name: "No data", value: 1 }]}
                    dataKey="value" nameKey="name"
                    cx="50%" cy="50%"
                    outerRadius={55} innerRadius={32}
                    paddingAngle={chartData.some(d => d.value > 0) ? 3 : 0}
                    startAngle={90} endAngle={-270}
                  >
                    {chartData.some(d => d.value > 0)
                      ? <><Cell fill="#22c55e" /><Cell fill="#facc15" /></>
                      : <Cell fill="#e2e8f0" />}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {[
            { label: "Present",  pct: attendancePct, color: "#22c55e" },
            { label: "On leave", pct: onLeavePct,    color: "#facc15" },
          ].map((item) => (
            <div key={item.label} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: item.color }} />
                  <span style={{ fontSize: 11, color: "#64748b" }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>{item.pct}%</span>
              </div>
              <div style={{ height: 4, background: "#f1f5f9", borderRadius: 99 }}>
                <div style={{ height: "100%", borderRadius: 99, background: item.color, width: `${item.pct}%`, transition: "width 0.4s ease" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Department headcount */}
        <div style={{ ...card, padding: "16px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 }}>Department headcount</h3>
            <span style={{ fontSize: 10, color: "#94a3b8" }}>this month</span>
          </div>
          {depts.length === 0
            ? <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>No data</p>
            : depts.map(([dept, count], i) => (
              <div key={dept} style={{ marginBottom: i < depts.length - 1 ? 12 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "#334155" }}>{dept}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{count}</span>
                </div>
                <div style={{ height: 4, background: "#f1f5f9", borderRadius: 99 }}>
                  <div style={{ height: "100%", borderRadius: 99, background: "#2563eb", width: `${Math.round((count / maxDept) * 100)}%`, transition: "width 0.4s ease" }} />
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* ── ZONE 3: ACTIVITY & PAYROLL ── */}
      <p style={{ fontSize: 9, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
        Zone 3 — Activity & Payroll (Bottom Row)
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 10 }}>

        {/* Recent activity */}
        <div style={{ ...card, padding: "16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 }}>Recent employee activity</h3>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>today</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                {["Employee","Department","Check-in","Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", paddingBottom: 7, fontSize: 11, fontWeight: 500, color: "#94a3b8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentEmployees.map((emp, i) => {
                const c = getColor(i);
                const st = emp.status === "Present" ? "Present" : emp.status === "Leave" ? "On leave" : "Absent";
                const ss = statusStyle(st);
                return (
                  <tr key={emp._id || i} style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td style={{ padding: "9px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: c.bg, color: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, flexShrink: 0 }}>{initials(emp.name)}</div>
                        <span style={{ fontSize: 12, fontWeight: 500, color: "#0f172a" }}>{emp.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "9px 0", fontSize: 12, color: "#64748b" }}>{emp.department}</td>
                    <td style={{ padding: "9px 0", fontSize: 12, color: "#64748b" }}>—</td>
                    <td style={{ padding: "9px 0" }}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: ss.bg, color: ss.color }}>{st}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Payroll snapshot */}
        <div style={{ ...card, padding: "16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 }}>Payroll snapshot</h3>
            <span style={{ fontSize: 10, color: "#94a3b8" }}>
              {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </span>
          </div>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 8px" }}>Total payroll</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", margin: "0 0 14px" }}>
            ₹{totalPayroll.toLocaleString("en-IN")}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
            {[
              { label: "Processed", value: present, color: "#16a34a" },
              { label: "Pending",   value: pending,  color: "#f97316" },
            ].map((s) => (
              <div key={s.label} style={{ background: "#f8fafc", borderRadius: 9, padding: "9px 12px", border: "1px solid #f1f5f9" }}>
                <p style={{ fontSize: 10, color: "#64748b", margin: "0 0 3px" }}>{s.label}</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: s.color, margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#0f172a", margin: "0 0 5px" }}>Processing status</p>
          <div style={{ height: 5, background: "#f1f5f9", borderRadius: 99, marginBottom: 5 }}>
            <div style={{ height: "100%", borderRadius: 99, background: "#22c55e", width: total > 0 ? `${attendancePct}%` : "0%", transition: "width 0.4s ease" }} />
          </div>
          <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>{present} of {total} processed · {attendancePct}%</p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
