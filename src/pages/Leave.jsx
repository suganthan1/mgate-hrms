import axios from "axios";
import { useEffect } from "react";

const Leave = ({

  leaveRequests,

  userRole,

  setShowLeaveModal,

  fetchLeaves,

}) => {

  useEffect(() => {

    fetchLeaves();

  }, []);

  return (

    <div className="bg-white rounded-3xl shadow-xl p-8">

      <h1 className="text-5xl font-bold mb-2">
        Leave Management
      </h1>

      {["Employee", "HR", "Admin", "Manager"].includes(userRole) && (

        <button
          onClick={() =>
            setShowLeaveModal(true)
          }
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl mt-5"
        >
          Apply Leave
        </button>

      )}

      <p className="text-gray-500 mb-10">

        {userRole === "Admin"

          ? "Approve or reject employee leave requests"

          : "Apply and track your leave requests"}

      </p>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left py-4">
              Employee
            </th>

            <th className="text-left py-4">
              Leave Type
            </th>

            <th className="text-left py-4">
              Status
            </th>

            <th className="text-left py-4">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {leaveRequests.map((leave) => (

            <tr
              key={leave._id}
              className="border-b"
            >

              <td className="py-5">
                {leave.employee}
              </td>

              <td className="py-5">
                {leave.leaveType}
              </td>

              <td className="py-5">

              <span
  className={`px-4 py-2 rounded-full text-sm font-semibold ${
    leave.status === "Approved"
      ? "bg-green-100 text-green-700"
      : leave.status === "Rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700"
  }`}
>
  {leave.status}
</span>

              </td>

              <td className="py-5">

                <div className="flex gap-3">

                 

<button
  disabled={leave.status === "Approved" ||
leave.status === "Rejected"}
  onClick={async () => {

    await axios.put(
      `http://localhost:5000/leave-status/${leave._id}`,
      {
        status: "Approved",
      }
    );

    fetchLeaves();

  }}
  className={`text-white px-4 py-2 rounded-xl ${
    leave.status === "Approved" ||
leave.status === "Rejected"
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700"
  }`}
>
  Approve
</button>

<button
  disabled={leave.status === "Approved" ||
leave.status === "Rejected"}
  onClick={async () => {

    await axios.put(
      `http://localhost:5000/leave-status/${leave._id}`,
      {
        status: "Rejected",
      }
    );

    fetchLeaves();

  }}
  className={`text-white px-4 py-2 rounded-xl ${
    leave.status === "Approved" ||
leave.status === "Rejected"
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-red-600 hover:bg-red-700"
  }`}
>
  Reject
</button>
                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

};

export default Leave;