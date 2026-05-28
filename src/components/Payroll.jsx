import axios from "axios";
import { useEffect, useState } from "react";
import { Plus, Users, Wallet, TrendingUp, Clock, ChevronLeft, ChevronRight } from "lucide-react";

const Payroll = () => {

  const [payroll, setPayroll] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchPayroll = async () => {
    try {
      const response = await axios.get("http://localhost:5000/payroll");
      setPayroll(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { fetchPayroll(); }, []);

  const generatePayroll = async () => {
    try {
      await axios.post("http://localhost:5000/payroll", {
        employee: "Suganthan",
        department: "IT",
        salary: 50000,
        bonus: 5000,
        deduction: 2000,
        netSalary: 53000,
        month: "May",
        status: "Pending",
      });
      fetchPayroll();
    } catch (error) {
      console.log(error);
    }
  };

  const markAsPaid = async (id) => {
    try {
      await axios.put(`http://localhost:5000/payroll/${id}`, { status: "Paid" });
      fetchPayroll();
    } catch (error) {
      console.log(error);
    }
  };

  const totalPayroll = payroll.reduce((sum, item) => sum + item.netSalary, 0);
  const paidAmount   = payroll.filter(i => i.status === "Paid").reduce((s, i) => s + i.netSalary, 0);
  const pendingAmount = payroll.filter(i => i.status === "Pending").reduce((s, i) => s + i.netSalary, 0);

  const totalPages = Math.ceil(payroll.length / rowsPerPage);
  const paginated  = payroll.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const statCards = [
    {
      label: "Total Employees",
      value: payroll.length,
      sub: "This Month",
      icon: <Users size={26} color="#2563eb" />,
      iconBg: "#eff6ff",
      valueColor: "#0f172a",
      prefix: "",
    },
    {
      label: "Total Payroll",
      value: totalPayroll.toLocaleString("en-IN"),
      sub: "This Month",
      icon: <Wallet size={26} color="#16a34a" />,
      iconBg: "#f0fdf4",
      valueColor: "#16a34a",
      prefix: "₹",
    },
    {
      label: "Paid",
      value: paidAmount.toLocaleString("en-IN"),
      sub: "This Month",
      icon: <TrendingUp size={26} color="#f97316" />,
      iconBg: "#fff7ed",
      valueColor: "#0f172a",
      prefix: "₹",
    },
    {
      label: "Pending",
      value: pendingAmount.toLocaleString("en-IN"),
      sub: "This Month",
      icon: <Clock size={26} color="#ef4444" />,
      iconBg: "#fef2f2",
      valueColor: "#ef4444",
      prefix: "₹",
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* PAGE HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a" }}>Payroll</h1>

        <button
          onClick={generatePayroll}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#2563eb", color: "#fff",
            border: "none", borderRadius: 12,
            padding: "13px 24px", fontSize: 15, fontWeight: 600,
            cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
        >
          <Plus size={18} strokeWidth={2.5} />
          Generate Payroll
        </button>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 }}>
        {statCards.map((card, i) => (
          <div
            key={i}
            style={{
              background: "#fff", borderRadius: 16,
              border: "1px solid #f1f5f9",
              padding: "24px 24px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              display: "flex", alignItems: "flex-start", gap: 16,
            }}
          >
            {/* ICON BADGE */}
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: card.iconBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {card.icon}
            </div>

            {/* TEXT */}
            <div>
              <p style={{ fontSize: 13, color: "#64748b", fontWeight: 500, marginBottom: 4 }}>
                {card.label}
              </p>
              <p style={{ fontSize: 26, fontWeight: 700, color: card.valueColor, lineHeight: 1.1, marginBottom: 4 }}>
                {card.prefix}{card.value}
              </p>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE CARD */}
      <div style={{
        background: "#fff", borderRadius: 16,
        border: "1px solid #f1f5f9",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        padding: "28px 28px 24px",
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>
          Payroll List
        </h2>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
              {["Employee","Department","Salary","Bonus","Deduction","Net Salary","Month","Status","Action"].map((h) => (
                <th key={h} style={{
                  textAlign: "left", padding: "12px 12px 16px",
                  fontSize: 14, fontWeight: 700, color: "#0f172a",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: 48, color: "#94a3b8", fontSize: 14 }}>
                  No payroll records. Click "Generate Payroll" to add one.
                </td>
              </tr>
            ) : (
              paginated.map((item) => (
                <tr
                  key={item._id}
                  style={{ borderBottom: "1px solid #f8fafc" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "18px 12px", fontSize: 14, fontWeight: 600, color: "#0f172a" }}>
                    {item.employee}
                  </td>
                  <td style={{ padding: "18px 12px", fontSize: 14, color: "#334155" }}>
                    {item.department}
                  </td>
                  <td style={{ padding: "18px 12px", fontSize: 14, color: "#334155" }}>
                    ₹{Number(item.salary).toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "18px 12px", fontSize: 14, fontWeight: 600, color: "#16a34a" }}>
                    ₹{Number(item.bonus).toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "18px 12px", fontSize: 14, fontWeight: 600, color: "#ef4444" }}>
                    ₹{Number(item.deduction).toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "18px 12px", fontSize: 14, fontWeight: 700, color: "#2563eb" }}>
                    ₹{Number(item.netSalary).toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: "18px 12px", fontSize: 14, color: "#334155" }}>
                    {item.month}
                  </td>
                  <td style={{ padding: "18px 12px" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "5px 14px", borderRadius: 999,
                      fontSize: 13, fontWeight: 600,
                      background: item.status === "Paid" ? "#dcfce7" : "#fef9c3",
                      color: item.status === "Paid" ? "#16a34a" : "#ca8a04",
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: "18px 12px" }}>
                    <button
                      disabled={item.status === "Paid"}
                      onClick={() => markAsPaid(item._id)}
                      style={{
                        background: item.status === "Paid" ? "#e2e8f0" : "#16a34a",
                        color: item.status === "Paid" ? "#94a3b8" : "#fff",
                        border: "none", borderRadius: 8,
                        padding: "9px 18px", fontSize: 13, fontWeight: 600,
                        cursor: item.status === "Paid" ? "not-allowed" : "pointer",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        if (item.status !== "Paid") e.currentTarget.style.background = "#15803d";
                      }}
                      onMouseLeave={(e) => {
                        if (item.status !== "Paid") e.currentTarget.style.background = "#16a34a";
                      }}
                    >
                      Mark Paid
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #f1f5f9",
          paddingTop: 20, marginTop: 8,
        }}>
          <p style={{ fontSize: 13, color: "#94a3b8" }}>
            Showing {payroll.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(currentPage * rowsPerPage, payroll.length)} of {payroll.length} entries
          </p>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              style={{
                width: 36, height: 36, borderRadius: 8,
                border: "1px solid #e2e8f0", background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                color: currentPage === 1 ? "#cbd5e1" : "#334155",
              }}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  border: page === currentPage ? "none" : "1px solid #e2e8f0",
                  background: page === currentPage ? "#2563eb" : "#fff",
                  color: page === currentPage ? "#fff" : "#334155",
                  fontWeight: page === currentPage ? 700 : 500,
                  fontSize: 14, cursor: "pointer",
                }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages || 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{
                width: 36, height: 36, borderRadius: 8,
                border: "1px solid #e2e8f0", background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                color: currentPage >= totalPages ? "#cbd5e1" : "#334155",
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payroll;
