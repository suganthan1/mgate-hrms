import { useState } from "react";
import { Search, FileSpreadsheet, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";

const Employees = ({
  employees = [],
  searchTerm,
  setSearchTerm,
  sortOrder,
  setSortOrder,
  statusFilter,
  setStatusFilter,
  filteredEmployees = [],
  setSelectedEmployee,
  editEmployee,
  deleteEmployee,
  onAddEmployee,
  onExportExcel,
}) => {

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const sorted = [...filteredEmployees].sort((a, b) =>
    sortOrder === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  );

  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const paginated = sorted.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
   <div
  style={{
    fontFamily: "'Inter', sans-serif",
    width: "100%",
    maxWidth: 1320,
    margin: "0 auto",
  }}
>

      {/* PAGE HEADER */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
            Employees
          </h1>
          <p style={{ fontSize: 14, color: "#94a3b8" }}>Manage and view employee details</p>
        </div>

        {/* ACTION BUTTONS */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={onExportExcel}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#16a34a", color: "#fff",
              border: "none", borderRadius: 10,
              padding: "11px 20px", fontSize: 14, fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <FileSpreadsheet size={16} />
            Export Excel
          </button>

          <button
            onClick={onAddEmployee}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#2563eb", color: "#fff",
              border: "none", borderRadius: 10,
              padding: "11px 20px", fontSize: 14, fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Plus size={16} />
            Add Employee
          </button>
        </div>
      </div>

      {/* SEARCH + SORT + FILTER ROW */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 28,
    flexWrap: "wrap",
  }}
>

        {/* SEARCH */}
        <div style={{ position: "relative" }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{ position: "absolute", top: "50%", left: 16, transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            placeholder="Search employee..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
           style={{
  border: "1px solid #dbe4ee",
  borderRadius: 12,
  padding: "0 18px 0 46px",
  fontSize: 14,
  fontWeight: 500,
  color: "#0f172a",
  width: 360,
  height: 52,
  outline: "none",
  background: "#ffffff",
  boxSizing: "border-box",
}}
          />
        </div>

      {/* SORT BUTTON */}
<button
  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "1px solid #dbe4ee",
    borderRadius: 12,
    padding: "0 18px",
    minWidth: 140,
    height: 52,
    justifyContent: "space-between",
    fontSize: 14,
    fontWeight: 600,
    background: "#fff",
    color: "#0f172a",
    cursor: "pointer",
  }}
>
  Sort {sortOrder === "asc" ? "Z-A" : "A-Z"}
  <ChevronsUpDown size={14} color="#64748b" />
</button>

        {/* STATUS FILTER */}
<select
  value={statusFilter}
  onChange={(e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  }}
  style={{
    border: "1px solid #dbe4ee",
    borderRadius: 12,
    padding: "0 18px",
    width: 140,
    height: 52,
    fontSize: 14,
    fontWeight: 600,
    color: "#0f172a",
    background: "#fff",
    cursor: "pointer",
    outline: "none",
    appearance: "none",
  }}
>
  <option value="All">All</option>
  <option value="Present">Present</option>
  <option value="Leave">Leave</option>
</select>
</div>
     {/* TABLE CARD */}
<div
  style={{
    background: "#ffffff",
    borderRadius: 20,
    border: "1px solid #f1f5f9",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    overflow: "hidden",
    padding: "0 32px 28px",
    width: "100%",
  }}
>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
              {["Name", "Department", "Reporting Manager", "Status", "Salary", "Action"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left", padding: "20px 12px 16px",
                    fontSize: 14, fontWeight: 700, color: "#0f172a",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontSize: 14 }}>
                  No employees found.
                </td>
              </tr>
            ) : (
              paginated.map((employee) => (
                <tr
                  key={employee._id}
                  style={{ borderBottom: "1px solid #f8fafc" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {/* NAME */}
                  <td style={{ padding: "18px 12px" }}>
                    <button
                      onClick={() => setSelectedEmployee(employee)}
                      style={{
                        background: "none", border: "none",
                        color: "#2563eb", fontWeight: 600,
                        fontSize: 14, cursor: "pointer", padding: 0,
                      }}
                    >
                      {employee.name}
                    </button>
                  </td>

                  {/* DEPARTMENT */}
                  <td style={{ padding: "18px 12px", fontSize: 14, color: "#334155" }}>
                    {employee.department}
                  </td>

                  {/* REPORTING MANAGER */}
                  <td style={{ padding: "18px 12px", fontSize: 14, color: "#334155" }}>
                    {employee.reportingManager || "N/A"}
                  </td>

                  {/* STATUS */}
                  <td style={{ padding: "18px 12px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "5px 14px",
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 600,
                        background: employee.status === "Present" ? "#dcfce7" : "#fef9c3",
                        color: employee.status === "Present" ? "#16a34a" : "#ca8a04",
                      }}
                    >
                      {employee.status}
                    </span>
                  </td>

                  {/* SALARY */}
                  <td style={{ padding: "18px 12px", fontSize: 14, fontWeight: 700, color: "#16a34a" }}>
                    ₹{Number(employee.salary || 25000).toLocaleString("en-IN")}
                  </td>

                  {/* ACTIONS */}
                  <td style={{ padding: "18px 12px" }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        onClick={() => editEmployee(employee)}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          background: "#f59e0b", color: "#fff",
                          border: "none", borderRadius: 8,
                          padding: "8px 16px", fontSize: 13, fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        <Pencil size={13} />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteEmployee(employee._id)}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          background: "#ef4444", color: "#fff",
                          border: "none", borderRadius: 8,
                          padding: "8px 16px", fontSize: 13, fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div
          style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 20, marginTop: 4,
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <p style={{ fontSize: 13, color: "#94a3b8" }}>
            Showing {sorted.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(currentPage * rowsPerPage, sorted.length)} of {sorted.length} entries
          </p>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
                  border: "none",
                  background: page === currentPage ? "#2563eb" : "#fff",
                  color: page === currentPage ? "#fff" : "#334155",
                  fontWeight: page === currentPage ? 700 : 500,
                  fontSize: 14, cursor: "pointer",
                  border: page === currentPage ? "none" : "1px solid #e2e8f0",
                }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              style={{
                width: 36, height: 36, borderRadius: 8,
                border: "1px solid #e2e8f0", background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                color: currentPage === totalPages ? "#cbd5e1" : "#334155",
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

export default Employees;
