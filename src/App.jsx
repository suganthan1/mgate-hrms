import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./components/Attendance";
import Payroll from "./components/Payroll";import Leave from "./pages/Leave";
import EmployeeModal from "./components/EmployeeModal";
import logo from "./assets/logo.png";

import {
  fetchEmployeesAPI,
  addEmployeeAPI,
  updateEmployeeAPI,
} from "./services/employeeService";

export default function HRMSApp() {

  // ── AUTH ──────────────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn]       = useState(false);
  const [userRole, setUserRole]           = useState("Admin");
  const [loggedInEmployee, setLoggedInEmployee] = useState(null);
  const [profileImage, setProfileImage]   = useState("");
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");

  // ── UI ────────────────────────────────────────────────────────────────────
  const [activePage, setActivePage]       = useState("dashboard");
  const [darkMode, setDarkMode]           = useState(false);
  const [showModal, setShowModal]         = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showProfile, setShowProfile]     = useState(false);
  const [notification, setNotification]   = useState("");
  const [notificationType, setNotificationType] = useState("success");

  // ── EMPLOYEE FORM ─────────────────────────────────────────────────────────
  const [editingEmployee, setEditingEmployee]   = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeName, setEmployeeName]         = useState("");
  const [department, setDepartment]             = useState("");
  const [employeeEmail, setEmployeeEmail]       = useState("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [employeePhone, setEmployeePhone]       = useState("");
  const [employeeRole, setEmployeeRole]         = useState("");
  const [reportingManager, setReportingManager] = useState("");
  const [joiningDate, setJoiningDate]           = useState("");
  const [salary, setSalary]                     = useState("");
  const [status, setStatus]                     = useState("Present");

  // ── DATA ──────────────────────────────────────────────────────────────────
  const [employees, setEmployees]     = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [searchTerm, setSearchTerm]   = useState("");
  const [sortOrder, setSortOrder]     = useState("asc");
  const [statusFilter, setStatusFilter] = useState("All");

  const [departments, setDepartments] = useState(["IT", "HR", "Management"]);
  const [departmentName, setDepartmentName] = useState("");

  const [leaveType, setLeaveType]   = useState("");
  const [leaveFrom, setLeaveFrom]   = useState("");
  const [leaveTo, setLeaveTo]       = useState("");
  const [leaveReason, setLeaveReason] = useState("");

  const [holidays] = useState([
    { name: "New Year",      date: "2026-01-01" },
    { name: "Pongal",        date: "2026-01-14" },
    { name: "Republic Day",  date: "2026-01-26" },
  ]);

  // ── HELPERS ───────────────────────────────────────────────────────────────
  const hasAccess = (roles) => roles.includes(userRole);

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "All" || emp.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const resetForm = () => {
    setEmployeeName(""); setDepartment(""); setEmployeeEmail("");
    setEmployeePassword(""); setEmployeePhone(""); setEmployeeRole("");
    setJoiningDate(""); setSalary(""); setReportingManager("");
    setStatus("Present");
  };

  const showNotif = (msg, type = "success") => {
    setNotification(msg);
    setNotificationType(type);
    setTimeout(() => setNotification(""), 3000);
  };

  // ── API ───────────────────────────────────────────────────────────────────
  const fetchEmployees = async () => {
    try {
      const data = await fetchEmployeesAPI();
      setEmployees(data);
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        localStorage.clear();
        setIsLoggedIn(false);
        alert("Session Expired. Login Again.");
      }
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:5000/leaves");
      setLeaveRequests(res.data);
    } catch (e) { console.log(e); }
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:5000/attendance");
      setAttendanceRecords(res.data);
    } catch (e) { console.log(e); }
  };

  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
    fetchAttendance();
  }, []);

  useEffect(() => {
    const token    = localStorage.getItem("token");
    const role     = localStorage.getItem("role");
    const employee = JSON.parse(localStorage.getItem("employee"));
    const img      = localStorage.getItem("profileImage") || "";
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
      setLoggedInEmployee(employee);
      setProfileImage(img);
    }
  }, []);

  const addEmployee = async () => {
    if (!employeeName.trim() || !department.trim()) {
      alert("Please fill all required fields"); return;
    }
    try {
      await addEmployeeAPI({
        name: employeeName, department, email: employeeEmail,
        password: employeePassword, phone: employeePhone,
        role: employeeRole, joiningDate, salary,
        reportingManager, status: "Present",
      });
      fetchEmployees();
      resetForm();
      setShowModal(false);
      setEditingEmployee(null);
      showNotif("Employee added successfully");
    } catch (e) { console.log(e); }
  };

  const updateEmployee = async () => {
    try {
      await updateEmployeeAPI(editingEmployee._id, {
        name: employeeName, department, email: employeeEmail,
        phone: employeePhone, role: employeeRole,
        joiningDate, salary, status: editingEmployee.status,
      });
      fetchEmployees();
      resetForm();
      setShowModal(false);
      setEditingEmployee(null);
      showNotif("Employee updated successfully");
    } catch (e) { console.log(e); }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await axios.delete(`http://localhost:5000/employees/${id}`);
      fetchEmployees();
      showNotif("Employee deleted", "error");
    } catch (e) { console.log(e); }
  };

  const editEmployee = (employee) => {
    setEditingEmployee(employee);
    setEmployeeName(employee.name);
    setDepartment(employee.department);
    setEmployeeEmail(employee.email || "");
    setEmployeePhone(employee.phone || "");
    setEmployeeRole(employee.role || "");
    setJoiningDate(employee.joiningDate || "");
    setSalary(employee.salary || "");
    setReportingManager(employee.reportingManager || "");
    setShowModal(true);
  };

  const toggleStatus = async (employee) => {
    try {
      const newStatus = employee.status === "Present" ? "Leave" : "Present";
      await axios.put(`http://localhost:5000/employees/${employee._id}`, {
        ...employee, status: newStatus,
      });
      fetchEmployees();
    } catch (e) { console.log(e); }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(employees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "employees.xlsx");
  };

  const downloadPayslip = (employee) => {
    const doc = new jsPDF();
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 220, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("MGate HRMS Payslip", 20, 22);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Employee: ${employee.name}`, 20, 55);
    doc.text(`Department: ${employee.department}`, 20, 72);
    doc.text(`Salary: ₹${employee.salary || 25000}`, 20, 89);
    doc.text(`Status: ${employee.status}`, 20, 106);
    doc.save(`${employee.name}-Payslip.pdf`);
  };

  const addDepartment = () => {
    if (!departmentName.trim()) { alert("Enter department name"); return; }
    setDepartments([...departments, departmentName]);
    setDepartmentName("");
  };

  const deleteDepartment = (index) => {
    const updated = [...departments];
    updated.splice(index, 1);
    setDepartments(updated);
  };

  // ── LOGIN PAGE ────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: "100vh", background: "#f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Inter', sans-serif", padding: 24,
      }}>
        <div style={{
          background: "#fff", borderRadius: 24,
          boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
          overflow: "hidden", width: "100%", maxWidth: 900,
          display: "grid", gridTemplateColumns: "1fr 1fr",
        }}>
          {/* LEFT */}
          <div style={{ padding: "48px 40px" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <img src={logo} alt="logo" style={{ width: 160, marginBottom: 12 }} />
              <p style={{ color: "#94a3b8", fontSize: 14 }}>Employee Management System</p>
            </div>

            {/* ROLE SELECTOR */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {["Super Admin","Admin","HR","Manager","Finance","Employee"].map((role) => (
                <button key={role} onClick={() => setUserRole(role)} style={{
                  padding: "6px 14px", borderRadius: 8, border: "none",
                  background: userRole === role ? "#2563eb" : "#f1f5f9",
                  color: userRole === role ? "#fff" : "#0f172a",
                  fontSize: 13, fontWeight: 500, cursor: "pointer",
                }}>{role}</button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input type="email" placeholder="Email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "13px 16px", fontSize: 14, outline: "none" }}
              />
              <input type="password" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "13px 16px", fontSize: 14, outline: "none" }}
              />
              <button
                onClick={async () => {
                  try {
                    const res = await axios.post("http://localhost:5000/login", { email, password });
                    setUserRole(res.data.role);
                    setLoggedInEmployee(res.data.employee);
                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem("role", res.data.role);
                    localStorage.setItem("employee", JSON.stringify(res.data.employee));
                    setIsLoggedIn(true);
                  } catch { alert("Invalid Email or Password"); }
                }}
                style={{
                  background: "#2563eb", color: "#fff", border: "none",
                  borderRadius: 12, padding: "14px", fontSize: 15,
                  fontWeight: 600, cursor: "pointer",
                }}
              >Sign In</button>
            </div>

            <div style={{ marginTop: 24 }}>
              <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 8 }}>Demo Credentials</p>
              {[["admin@mgatetech.com","admin123"],["employee@mgatetech.com","employee123"]].map(([e,p]) => (
                <div key={e} style={{ background: "#f8fafc", borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
                  <p style={{ fontWeight: 600, fontSize: 13 }}>{e}</p>
                  <p style={{ color: "#64748b", fontSize: 13 }}>{p}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div style={{
            background: "#2563eb", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 48,
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>👨‍💼</div>
              <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 14 }}>Welcome to MGate HRMS</h2>
              <p style={{ color: "#bfdbfe", fontSize: 15, lineHeight: 1.7 }}>
                Manage employees, attendance,<br />payroll, leave requests and<br />company operations in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN APP ──────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: darkMode ? "#0f172a" : "#f1f5f9",
      fontFamily: "'Inter', sans-serif",
    }}>

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLogout={() => { localStorage.clear(); setIsLoggedIn(false); }}
      />

      <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>

        {/* NOTIFICATION BANNER */}
        {notification && (
          <div style={{
            padding: "12px 20px", borderRadius: 10, marginBottom: 20,
            background: notificationType === "success" ? "#16a34a" : notificationType === "error" ? "#ef4444" : "#f59e0b",
            color: "#fff", fontSize: 14, fontWeight: 500,
          }}>{notification}</div>
        )}

        {/* DASHBOARD */}
{activePage === "dashboard" && (
  <>
    {/* DASHBOARD HEADER - only shows on dashboard */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#2563eb", marginBottom: 4 }}>
          MGate HRMS
        </h1>
        <p style={{ fontSize: 14, color: "#94a3b8" }}>Admin Portal</p>
      </div>
    </div>
    <Dashboard employees={employees} leaves={leaveRequests} />
  </>
)}

        {/* EMPLOYEES */}
        {activePage === "employees" && hasAccess(["Super Admin","Admin","HR"]) && (
          <Employees
            employees={employees}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredEmployees={filteredEmployees}
            setSelectedEmployee={setSelectedEmployee}
            editEmployee={editEmployee}
            deleteEmployee={deleteEmployee}
            onAddEmployee={() => { resetForm(); setEditingEmployee(null); setShowModal(true); }}
            onExportExcel={exportToExcel}
          />
        )}

        {/* ATTENDANCE */}
        {activePage === "attendance" && <Attendance />}

        {/* LEAVE */}
        {activePage === "leave" && (
          <Leave
            leaveRequests={leaveRequests}
            userRole={userRole}
            setShowLeaveModal={setShowLeaveModal}
            fetchLeaves={fetchLeaves}
          />
        )}

        {/* PAYROLL */}
        {activePage === "payroll" && <Payroll />}

        {/* DEPARTMENTS */}
        {activePage === "departments" && hasAccess(["Super Admin","Admin","HR"]) && (
          <div style={{ fontFamily: "'Inter', sans-serif" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Departments</h1>
                <p style={{ fontSize: 14, color: "#94a3b8" }}>Total Employees: {employees.length}</p>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <input type="text" placeholder="Department Name" value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 16px", fontSize: 14, outline: "none" }}
                />
                <button onClick={addDepartment} style={{
                  background: "#2563eb", color: "#fff", border: "none",
                  borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}>Add Department</button>
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", padding: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                    {["Department","Employees","Status","Action"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "12px", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                      <td style={{ padding: "14px 12px", fontSize: 14, fontWeight: 600 }}>{dept}</td>
                      <td style={{ padding: "14px 12px", fontSize: 14 }}>{employees.filter(e => e.department === dept).length}</td>
                      <td style={{ padding: "14px 12px" }}>
                        <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 13, fontWeight: 600, background: "#dcfce7", color: "#16a34a" }}>Active</span>
                      </td>
                      <td style={{ padding: "14px 12px" }}>
                        <button onClick={() => deleteDepartment(i)} style={{ background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* HOLIDAYS */}
        {activePage === "holidays" && (
          <div style={{ fontFamily: "'Inter', sans-serif" }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Holiday Calendar</h1>
            <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 28 }}>Company and public holidays</p>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", padding: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #f1f5f9" }}>
                    {["Holiday","Date"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "12px", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {holidays.map((h, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f8fafc" }}>
                      <td style={{ padding: "14px 12px", fontSize: 14, fontWeight: 600 }}>{h.name}</td>
                      <td style={{ padding: "14px 12px", fontSize: 14, color: "#64748b" }}>{h.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {activePage === "profile" && (
          <div style={{ fontFamily: "'Inter', sans-serif" }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", marginBottom: 28 }}>My Profile</h1>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", padding: 32, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", maxWidth: 480 }}>
              {[["Name", loggedInEmployee?.name],["Email", loggedInEmployee?.email],["Department", loggedInEmployee?.department],["Role", loggedInEmployee?.role],["Reporting Manager", loggedInEmployee?.reportingManager || "N/A"]].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>{label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANALYTICS / SETTINGS */}
        {activePage === "analytics" && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8", fontSize: 16 }}>Analytics coming soon...</div>
        )}
        {activePage === "settings" && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8", fontSize: 16 }}>Settings coming soon...</div>
        )}

      </div>

      {/* ── ADD / EDIT EMPLOYEE MODAL ── */}
      {showModal && (
        <EmployeeModal
          showModal={showModal}
          setShowModal={setShowModal}
          employeeName={employeeName}       setEmployeeName={setEmployeeName}
          department={department}           setDepartment={setDepartment}
          employeeEmail={employeeEmail}     setEmployeeEmail={setEmployeeEmail}
          employeePassword={employeePassword} setEmployeePassword={setEmployeePassword}
          employeePhone={employeePhone}     setEmployeePhone={setEmployeePhone}
          employeeRole={employeeRole}       setEmployeeRole={setEmployeeRole}
          joiningDate={joiningDate}         setJoiningDate={setJoiningDate}
          salary={salary}                   setSalary={setSalary}
          reportingManager={reportingManager} setReportingManager={setReportingManager}
          employees={employees}
          editingEmployee={editingEmployee}
          addEmployee={addEmployee}
          updateEmployee={updateEmployee}
        />
      )}

      {/* ── EMPLOYEE PROFILE MODAL ── */}
      {selectedEmployee && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "36px 40px", width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Employee Profile</h2>
              <button onClick={() => setSelectedEmployee(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#94a3b8" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                ["Employee ID", `EMP00${selectedEmployee._id?.slice(-3)}`],
                ["Name", selectedEmployee.name],
                ["Department", selectedEmployee.department],
                ["Email", selectedEmployee.email],
                ["Phone", selectedEmployee.phone],
                ["Role", selectedEmployee.role],
                ["Salary", selectedEmployee.salary ? `₹${Number(selectedEmployee.salary).toLocaleString("en-IN")}` : "—"],
                ["Joining Date", selectedEmployee.joiningDate],
                ["Status", selectedEmployee.status],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: 10 }}>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>{label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{val || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── LEAVE APPLY MODAL ── */}
      {showLeaveModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "36px 40px", width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Apply Leave</h2>
              <button onClick={() => setShowLeaveModal(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#94a3b8" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input type="text" placeholder="Leave Type" value={leaveType} onChange={e => setLeaveType(e.target.value)}
                style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 16px", fontSize: 14, outline: "none" }} />
              <input type="date" value={leaveFrom} onChange={e => setLeaveFrom(e.target.value)}
                style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 16px", fontSize: 14, outline: "none" }} />
              <input type="date" value={leaveTo} onChange={e => setLeaveTo(e.target.value)}
                style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 16px", fontSize: 14, outline: "none" }} />
              <textarea placeholder="Reason" value={leaveReason} onChange={e => setLeaveReason(e.target.value)}
                style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "12px 16px", fontSize: 14, outline: "none", height: 100, resize: "none" }} />
              <button onClick={async () => {
                try {
                  await axios.post("http://localhost:5000/apply-leave", {
                    employee: loggedInEmployee?.name, leaveType,
                    fromDate: leaveFrom, toDate: leaveTo, reason: leaveReason,
                  });
                  fetchLeaves();
                  setShowLeaveModal(false);
                  setLeaveType(""); setLeaveFrom(""); setLeaveTo(""); setLeaveReason("");
                  showNotif("Leave applied successfully");
                } catch (e) { console.log(e); }
              }} style={{
                background: "#2563eb", color: "#fff", border: "none",
                borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 600, cursor: "pointer",
              }}>Submit Leave Request</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
