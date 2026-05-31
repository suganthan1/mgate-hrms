import { useState } from "react";
import { Search, Plus, Users, Building2 } from "lucide-react";

const Departments = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const departments = [
    {
      id: 1,
      name: "IT",
      head: "Suganthan",
      employees: 12,
      created: "01-Jan-2026",
      status: "Active",
    },
    {
      id: 2,
      name: "HR",
      head: "Safeer",
      employees: 4,
      created: "01-Jan-2026",
      status: "Active",
    },
    {
      id: 3,
      name: "Finance",
      head: "Hari",
      employees: 3,
      created: "01-Jan-2026",
      status: "Active",
    },
  ];

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Departments
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: 5,
            }}
          >
            Manage company departments and teams
          </p>
        </div>

        <button
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "10px 18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 600,
          }}
        >
          <Plus size={16} />
          Add Department
        </button>
      </div>

      {/* DASHBOARD CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <Card
          icon={<Building2 size={20} />}
          title="Departments"
          value="3"
        />

        <Card
          icon={<Users size={20} />}
          title="Employees"
          value="19"
        />

        <Card
          icon={<Users size={20} />}
          title="Department Heads"
          value="3"
        />

        <Card
          icon={<Building2 size={20} />}
          title="Active Teams"
          value="3"
        />
      </div>

      {/* SEARCH */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 20,
          marginBottom: 20,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            position: "relative",
            maxWidth: 350,
          }}
        >
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 12,
              top: 12,
              color: "#94a3b8",
            }}
          />

          <input
            type="text"
            placeholder="Search department..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px 10px 10px 38px",
              border: "1px solid #e2e8f0",
              borderRadius: 10,
            }}
          />
        </div>
      </div>

      {/* TABLE */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 20,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <th style={{ textAlign: "left", padding: 12 }}>
                Department
              </th>

              <th style={{ textAlign: "left", padding: 12 }}>
                Department Head
              </th>

              <th style={{ textAlign: "left", padding: 12 }}>
                Employees
              </th>

              <th style={{ textAlign: "left", padding: 12 }}>
                Created
              </th>

              <th style={{ textAlign: "left", padding: 12 }}>
                Status
              </th>

              <th style={{ textAlign: "left", padding: 12 }}>
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((dept) => (
              <tr
                key={dept.id}
                style={{
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <td style={{ padding: 12 }}>
                  {dept.name}
                </td>

                <td style={{ padding: 12 }}>
                  {dept.head}
                </td>

                <td style={{ padding: 12 }}>
                  {dept.employees}
                </td>

                <td style={{ padding: 12 }}>
                  {dept.created}
                </td>

                <td style={{ padding: 12 }}>
                  <span
                    style={{
                      background: "#dcfce7",
                      color: "#15803d",
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Active
                  </span>
                </td>

                <td style={{ padding: 12 }}>
                  <button>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Card = ({ icon, title, value }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 14,
      padding: 20,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}
  >
    <div
      style={{
        marginBottom: 10,
        color: "#2563eb",
      }}
    >
      {icon}
    </div>

    <p
      style={{
        margin: 0,
        color: "#64748b",
        fontSize: 13,
      }}
    >
      {title}
    </p>

    <h2
      style={{
        margin: "8px 0 0",
        color: "#0f172a",
      }}
    >
      {value}
    </h2>
  </div>
);

export default Departments;