// src/components/HR.js
import React from 'react';

function HR({ hrRequests, updateHRRequestStatus }) {
  const handleStatusChange = (index, newStatus) => {
    updateHRRequestStatus(index, newStatus);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">HR Requests</h2>
      {hrRequests.length === 0 ? (
        <p>No HR requests available.</p>
      ) : (
        <ul className="space-y-4">
          {hrRequests.map((request, index) => (
            <li key={index} className="p-4 border rounded-md">
              <p><strong>Request ID:</strong> {request.requestId}</p>
              <p><strong>Staff Count:</strong> {request.staffCount}</p>
              <p><strong>Responsibilities:</strong> {request.responsibilities}</p>
              <p><strong>Time Frame:</strong> {request.timeFrame}</p>
              <p><strong>Status:</strong> {request.status}</p>
              <div className="mt-2">
                <select
                  value={request.status}
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                  className="border p-2 rounded"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Allocated">Allocated</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HR;
