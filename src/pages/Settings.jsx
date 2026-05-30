import { useState } from "react";
import { Bell, Lock, User, Building2, Globe, Shield, Save } from "lucide-react";

const card = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #e8eaed",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  padding: "22px 24px",
  marginBottom: 16,
};

const sectionTitle = { fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 };
const label = { fontSize: 13, color: "#475569", fontWeight: 500, marginBottom: 6, display: "block" };
const input = { border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 14px", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" };
const row = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 };

const Toggle = ({ checked, onChange }) => (
  <button onClick={() => onChange(!checked)} style={{
    width: 44, height: 26, borderRadius: 999,
    background: checked ? "#2563eb" : "#cbd5e1",
    border: "none", cursor: "pointer", padding: 3,
    display: "flex", alignItems: "center",
    justifyContent: checked ? "flex-end" : "flex-start",
    transition: "background 0.2s",
    flexShrink: 0,
  }}>
    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
  </button>
);

const ToggleRow = ({ label: lbl, sub, checked, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
    <div>
      <p style={{ fontSize: 14, fontWeight: 500, color: "#0f172a", margin: 0 }}>{lbl}</p>
      {sub && <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>{sub}</p>}
    </div>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

const Settings = () => {
  const [companyName, setCompanyName]   = useState("MGate Technologies");
  const [companyEmail, setCompanyEmail] = useState("hr@mgatetech.com");
  const [timezone, setTimezone]         = useState("Asia/Kolkata");
  const [currency, setCurrency]         = useState("INR");
  const [language, setLanguage]         = useState("English");

  const [emailNotif, setEmailNotif]     = useState(true);
  const [leaveAlerts, setLeaveAlerts]   = useState(true);
  const [payrollAlerts, setPayrollAlerts] = useState(false);
  const [attendanceAlerts, setAttendanceAlerts] = useState(true);

  const [twoFactor, setTwoFactor]       = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [passwordExpiry, setPasswordExpiry] = useState("90");

  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: 820 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: 0 }}>Settings</h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>Configure your HRMS preferences</p>
        </div>
        <button onClick={save} style={{
          display: "flex", alignItems: "center", gap: 8,
          background: saved ? "#16a34a" : "#2563eb", color: "#fff",
          border: "none", borderRadius: 10, padding: "10px 20px",
          fontSize: 14, fontWeight: 600, cursor: "pointer",
          transition: "background 0.2s",
        }}>
          <Save size={16} />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Company */}
      <div style={card}>
        <p style={sectionTitle}><Building2 size={16} color="#2563eb" /> Company Information</p>
        <div style={row}>
          <div>
            <label style={label}>Company Name</label>
            <input style={input} value={companyName} onChange={e => setCompanyName(e.target.value)} />
          </div>
          <div>
            <label style={label}>HR Email</label>
            <input style={input} type="email" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} />
          </div>
        </div>
        <div style={row}>
          <div>
            <label style={label}>Timezone</label>
            <select style={{ ...input, cursor: "pointer" }} value={timezone} onChange={e => setTimezone(e.target.value)}>
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
            </select>
          </div>
          <div>
            <label style={label}>Currency</label>
            <select style={{ ...input, cursor: "pointer" }} value={currency} onChange={e => setCurrency(e.target.value)}>
              <option value="INR">INR — Indian Rupee (₹)</option>
              <option value="USD">USD — US Dollar ($)</option>
              <option value="EUR">EUR — Euro (€)</option>
              <option value="GBP">GBP — British Pound (£)</option>
            </select>
          </div>
        </div>
        <div style={{ maxWidth: "50%" }}>
          <label style={label}>Language</label>
          <select style={{ ...input, cursor: "pointer" }} value={language} onChange={e => setLanguage(e.target.value)}>
            <option>English</option>
            <option>Tamil</option>
            <option>Hindi</option>
          </select>
        </div>
      </div>

      {/* Notifications */}
      <div style={card}>
        <p style={sectionTitle}><Bell size={16} color="#f59e0b" /> Notifications</p>
        <ToggleRow label="Email Notifications" sub="Receive system emails for key events" checked={emailNotif} onChange={setEmailNotif} />
        <ToggleRow label="Leave Request Alerts" sub="Notify when a leave is applied or approved" checked={leaveAlerts} onChange={setLeaveAlerts} />
        <ToggleRow label="Payroll Processing Alerts" sub="Notify on payroll run completion" checked={payrollAlerts} onChange={setPayrollAlerts} />
        <ToggleRow label="Attendance Alerts" sub="Daily attendance summary emails" checked={attendanceAlerts} onChange={setAttendanceAlerts} />
      </div>

      {/* Security */}
      <div style={card}>
        <p style={sectionTitle}><Shield size={16} color="#ef4444" /> Security</p>
        <ToggleRow label="Two-Factor Authentication" sub="Require OTP on every login" checked={twoFactor} onChange={setTwoFactor} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
          <div>
            <label style={label}>Session Timeout (minutes)</label>
            <select style={{ ...input, cursor: "pointer" }} value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}>
              {["15", "30", "60", "120"].map(v => <option key={v} value={v}>{v} min</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Password Expiry (days)</label>
            <select style={{ ...input, cursor: "pointer" }} value={passwordExpiry} onChange={e => setPasswordExpiry(e.target.value)}>
              {["30", "60", "90", "180", "Never"].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div style={{ ...card, border: "1px solid #fecaca", marginBottom: 0 }}>
        <p style={{ ...sectionTitle, color: "#ef4444" }}><Lock size={16} color="#ef4444" /> Danger Zone</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0 }}>Reset All Settings</p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>Restore all settings to factory defaults</p>
          </div>
          <button style={{
            background: "#fff", border: "1.5px solid #ef4444", color: "#ef4444",
            borderRadius: 9, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}
            onClick={() => window.confirm("Reset all settings to defaults?") && save()}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
