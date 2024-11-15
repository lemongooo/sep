import React, { useContext } from 'react';
import { RequestsContext } from '../context/RequestContext';

function HR() {
  const { hrRequests, updateHRRequestStatus } = useContext(RequestsContext);

  const handleStatusChange = (index, newStatus) => {
    updateHRRequestStatus(index, newStatus);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-4">HR Requests</h2>
        {(!hrRequests || hrRequests.length === 0) ? (
          <p className="text-gray-500">No HR requests available.</p>
        ) : (
          <ul className="space-y-4">
            {hrRequests.map((request, index) => (
              <li key={request.requestId} className="p-4 border border-gray-300 rounded-md">
                <p><strong>Request ID:</strong> {request.requestId}</p>
                <p><strong>Staff Count:</strong> {request.staffCount}</p>
                <p><strong>Responsibilities:</strong> {request.responsibilities}</p>
                <p><strong>Time Frame:</strong> {request.timeFrame}</p>
                <p><strong>Status:</strong> {request.status}</p>
                <div className="mt-2">
                  <select
                    value={request.status}
                    onChange={(e) => handleStatusChange(index, e.target.value)}
                    className="border p-2 rounded-md"
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
    </div>
  );
}

export default HR;