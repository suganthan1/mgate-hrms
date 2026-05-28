import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, Wallet, TrendingUp, Clock } from "lucide-react";

const Dashboard = ({
  employees = [],
  leaves = [],
}) => {

  const chartData = [
    {
      name: "Present",
      value: employees.filter((e) => e.status === "Present").length,
    },
    {
      name: "Leave",
      value: employees.filter((e) => e.status === "Leave").length,
    },
  ];

  const statCards = [
    {
      label: "Total Employees",
      value: employees.length,
      sub: "This Month",
      icon: <Users size={26} color="#2563eb" />,
      iconBg: "#eff6ff",
      valueColor: "#0f172a",
    },
    {
      label: "Present Employees",
      value: employees.filter((e) => e.status === "Present").length,
      sub: "This Month",
      icon: <Wallet size={26} color="#16a34a" />,
      iconBg: "#f0fdf4",
      valueColor: "#16a34a",
    },
    {
      label: "Employees On Leave",
      value: employees.filter((e) => e.status === "Leave").length,
      sub: "This Month",
      icon: <TrendingUp size={26} color="#f97316" />,
      iconBg: "#fff7ed",
      valueColor: "#0f172a",
    },
    {
      label: "Pending Leaves",
      value: leaves.filter((l) => l.status === "Pending").length,
      sub: "This Month",
      icon: <Clock size={26} color="#ef4444" />,
      iconBg: "#fef2f2",
      valueColor: "#ef4444",
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* STAT CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          marginBottom: 28,
        }}
      >
        {statCards.map((card, i) => (
          <div
            key={i}
            style={{
              background: "#ffffff",
              borderRadius: 16,
              border: "1px solid #f1f5f9",
              padding: "24px 28px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "flex-start",
              gap: 18,
            }}
          >
            {/* ICON */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: card.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {card.icon}
            </div>

            {/* TEXT */}
            <div>
              <p
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  fontWeight: 500,
                  marginBottom: 6,
                }}
              >
                {card.label}
              </p>
              <p
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: card.valueColor,
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {card.value}
              </p>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* WELCOME BANNER */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid #f1f5f9",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          padding: "32px 36px",
          marginBottom: 24,
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 10,
          }}
        >
          Welcome to MGate HRMS
        </h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>
          Manage employees, attendance, leave requests, payroll and company
          operations from one centralized dashboard.
        </p>
      </div>

      {/* EMPLOYEE ANALYTICS */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid #f1f5f9",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          padding: "28px 36px",
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 24,
          }}
        >
          Employee Analytics
        </h2>

        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label={({ name, value }) => `${name}: ${value}`}
              >
                <Cell fill="#22c55e" />
                <Cell fill="#facc15" />
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  fontSize: 13,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
