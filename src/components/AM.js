import React, { useContext } from "react";
import { RequestsContext } from "../context/RequestContext";

const AdministrationManager = () => {
  const { requests, updateRequestStatus } = useContext(RequestsContext);

  // 处理审批操作
  const handleStatusUpdate = (requestId, newStatus) => {
    console.log('Updating request:', requestId, 'to status:', newStatus);
    updateRequestStatus(requestId, newStatus);
  };

  const pendingRequests = requests.filter((req) => req.status === "Commented by FM");

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-6 rounded-md shadow-md">
        <h3 className="text-xl font-bold mb-4">
          Administration Manager - Review Requests
        </h3>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-500">No requests available for review.</p>
        ) : (
          <ul className="space-y-4">
            {pendingRequests.map((request) => (
              <li
                key={request.id}
                className="p-4 border border-gray-300 rounded-md"
              >
                <p>
                  <strong>Request ID:</strong> {request.id}
                </p>
                <p>
                  <strong>Client Name:</strong> {request.clientName}
                </p>
                <p>
                  <strong>Event Type:</strong> {request.eventType}
                </p>
                <p>
                  <strong>Date:</strong> {request.date}
                </p>
                <p>
                  <strong>Budget:</strong> {request.budget}
                </p>
                <p>
                  <strong>Details:</strong> {request.details}
                </p>
                <p>
                  <strong>Comment from FM:</strong>{" "}
                  {request.comment || "No comments"}
                </p>
                <p>
                  <strong>Status:</strong> {request.status || "Pending"}
                </p>
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() =>
                      handleStatusUpdate(request.id, "Approved by Administration")
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    disabled={
                      request.status === "Approved by Administration" ||
                      request.status === "Rejected by Administration"
                    }
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleStatusUpdate(request.id, "Rejected by Administration")
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    disabled={
                      request.status === "Approved by Administration" ||
                      request.status === "Rejected by Administration"
                    }
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdministrationManager;